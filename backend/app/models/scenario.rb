class Scenario < ApplicationRecord
  acts_as_paranoid
  audited
  has_and_belongs_to_many :suites
  has_and_belongs_to_many :steps
  has_many :scenario_runs

public
  def ordered_steps= (new_steps)
    new_steps = new_steps.map &method(:id_for_step)
    ScenariosStep.transaction do
      persist_steps(new_steps)
    end
  end

  def ordered_steps
    Step.joins(:scenarios_steps).order(:position).where(
      'scenarios_steps.scenario_id = ?', id
      )
  end

  private

  def persist_steps(steps)
    ScenariosStep.where("scenario_id = ?", id).delete_all
    addeds = steps.each_with_index.map &method(:create_step_association)
    addeds.map {|added| Step.find(added.step_id)}
  end

  def create_step_association(step_id, position)
    ScenariosStep.create!({
      step_id: step_id,
      scenario_id: id,
      position: position
    })
  end

  def id_for_step(step)
    if step.kind_of?(String) && step.to_i == 0
      ensure_exists(step).id
    elsif step.respond_to? :to_i
      step.to_i
    elsif !step.is_a? Integer
      step.id
    end
  end

  def ensure_exists(step_string)
    begin
      Step.create! **parse_step(step_string)
    rescue ActiveRecord::RecordNotUnique
      Step.find_by **parse_step(step_string)
    end
  end

  def parse_step(statement)
    keyword, text = statement.split(' ', 2)
    { text: text, keyword: keyword.downcase }
  end
end
