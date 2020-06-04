require 'rails_helper'

RSpec.describe ScenariosStep, type: :model do
  describe 'position methods' do
    it 'can have a scenario with 2 of the same step' do
      ScenariosStep.delete_all
      step = Step.create! keyword: 'given', text: 'a step'
      scenario = Scenario.create! name: 'a scenario'
      expect(step.id).not_to be nil
      expect(scenario.id).not_to be nil
      expect(ScenariosStep.count).to eq 0
      ScenariosStep.create! step_id: step.id, scenario_id: scenario.id, position: 2
      ScenariosStep.create! step_id: step.id, scenario_id: scenario.id, position: 3
      expect(ScenariosStep.count).to eq 2
    end
  end
end
