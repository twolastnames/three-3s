require 'rails_helper'

RSpec.describe "SuiteRuns", type: :request do
  describe 'invalid suite IDs' do
    it 'does not accept non-integer suite' do
      post '/threAS3/suite_runs', params: {
        suite_id: 'four hundred'
      }
      expect(response.status).to eq 400
    end

    it 'does not accept non-existant suite' do
      Suite.delete_all
      post '/threAS3/suite_runs', params: {
        suite_id: 400
      }
      expect(response.status).to eq 400
    end
  end

  it 'can have runs' do
    SuiteRun.delete_all
    ScenarioRun.delete_all
    ScenariosStep.delete_all
    Suite.delete_all
    Scenario.delete_all
    suite = Suite.create(name: 'for run creating')
    post '/threAS3/suite_runs', params: {
      suite_id: suite.id
    }
    expect(response.status).to eq 200
    id = JSON.parse(response.body)['id']
    get "/threAS3/suite_runs/#{id}"
    suite_id = JSON.parse(response.body)['record']['suite_id']
    expect(suite_id).to eq suite.id
    expect(response.status).to eq 200
  end
end
