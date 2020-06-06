class Scenario < ApplicationRecord
  acts_as_paranoid
  audited
  has_and_belongs_to_many :suites
  has_and_belongs_to_many :steps

public
  def ordered_steps= (new_steps)
    new_steps = new_steps.map do |step|
      step = step.to_i if step.respond_to? :to_i
      if step.is_a? Integer then step else step.id end
    end
    ScenariosStep.transaction do
      ScenariosStep.where("scenario_id = ?", id).delete_all
      addeds = new_steps.each_with_index.map &method(:create_step_association)
      addeds.map {|added| Step.find(added.step_id)}
    end
  end

  def ordered_steps
    step_ids = steps.map(&:id)
    scenarioSteps = ScenariosStep.where("scenario_id = ?", id)
    sorted = scenarioSteps.sort_by(&:position).map do |scenarioStep|
      Step.find(scenarioStep.step_id)
    end
  end

  private
  
  def create_step_association(step_id, position)
    ScenariosStep.create!({
      step_id: step_id,
      scenario_id: id,
      position: position
    })
  end
end
