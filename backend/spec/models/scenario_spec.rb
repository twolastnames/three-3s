require 'rails_helper'

RSpec.describe Scenario, type: :model do
  it 'can have many steps' do
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
end
