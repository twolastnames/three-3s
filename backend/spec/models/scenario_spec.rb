require 'rails_helper'

RSpec.describe Scenario, type: :model do
  it 'can have a steps' do
    scenario = Scenario.new name: 'my scenario name'
    scenario.save
    step = Step.new keyword: 'Given', text: 'a step'
    step.save
    scenario.steps << step
    scenario.save
    scenario = Scenario.find_by name: 'my scenario name'
    expect(scenario.steps.first.keyword).to eq('Given')
    expect(scenario.steps.first.text).to eq('a step')
  end

  it 'does not allow setting invalid steps' do
    ScenariosStep.delete_all
    Scenario.delete_all
    Step.delete_all
    scenario = Scenario.create! name: 'my scenario name'
    expect{
      scenario.ordered_steps = [ 99978 ]
    }.to raise_error(ActiveRecord::RecordNotFound)
  end

  it 'forgets other steps' do
    ScenariosStep.delete_all
    Scenario.delete_all
    Step.delete_all
    scenario = Scenario.create! name: 'my scenario name'
    removed_step = Step.create! keyword: 'when', text: 'my deleted step'
    scenario.ordered_steps = [removed_step]
    expect(scenario.ordered_steps.map(&:id)).to eq [removed_step.id]
    Step.delete_all
    kept_step = Step.create! keyword: 'when', text: 'my kept step'
    scenario.ordered_steps = [kept_step]
    expect(scenario.ordered_steps.map(&:id)).to eq [kept_step.id]
  end

  it 'can maintain order of steps in a scenario' do
    ScenariosStep.delete_all
    Scenario.delete_all
    Step.delete_all
    scenario = Scenario.create! name: 'my scenario name'
    step1 = Step.create! keyword: 'given', text: 'I have a step'
    step2 = Step.create! keyword: 'when', text: 'I push a button'
    step3 = Step.create! keyword: 'then', text: 'something happens'
    expect(Step.count).to eq 3
    scenario.ordered_steps = [
      step1.id,
      step2,
      step3,
      step2.id,
      step3.id,
      ]
    id = scenario.id
    target = Scenario.find(id)
    expect(target.ordered_steps).to eq [
      step1,
      step2,
      step3,
      step2,
      step3,
      ]
  end
end
