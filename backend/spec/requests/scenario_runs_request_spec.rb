require 'rails_helper'


RSpec.describe "ScenarioRuns", type: :request do
  include RequestHelper

  def nilify_step_ids(body)
    body[:records].each { |record| nilify_ids(record[:steps]) }
  end

  describe 'a set up run' do
    scenario1_id = nil
    scenario2_id = nil
    scenario3_id = nil
    run_id = nil
    suite_id = nil

    before :all do
      SuiteRun.delete_all
      ScenarioRun.delete_all
      ScenariosStep.delete_all
      Suite.delete_all
      Scenario.delete_all
      post '/threAS3/scenarios', params: {name: 'my Scenario1'}
      expect(response.status).to eq 200

      scenario1_id = JSON.parse(response.body)['id']
      post '/threAS3/scenarios', params: {name: 'my Scenario2'}
      expect(response.status).to eq 200

      scenario2_id = JSON.parse(response.body)['id']
      post '/threAS3/scenarios', params: {name: 'my Scenario3'}
      expect(response.status).to eq 200

      scenario3_id = JSON.parse(response.body)['id']
      patch "/threAS3/scenarios/#{scenario1_id}", params: {
        add_steps: [
          'given a scenario',
          'then something happened',
        ]
      }
      expect(response.status).to eq 200
      patch "/threAS3/scenarios/#{scenario2_id}", params: {
        add_steps: [
          'given a scenario',
          'then nothing happened',
        ]
      }
      expect(response.status).to eq 200
      patch "/threAS3/scenarios/#{scenario3_id}", params: {
        add_steps: [
          'given a third scenario',
          'then nothing happened',
        ]
      }
      expect(response.status).to eq 200
      post '/threAS3/suites', params: { name: 'for run creating' }

      expect(response.status).to eq 200
      suite_id = JSON.parse(response.body)['id']
      patch "/threAS3/scenarios/#{scenario1_id}", params: {
        add_suite_id: suite_id,
      }
      expect(response.status).to eq 200
      patch "/threAS3/scenarios/#{scenario2_id}", params: {
        add_suite_id: suite_id,
      }
      expect(response.status).to eq 200
      patch "/threAS3/scenarios/#{scenario3_id}", params: {
        add_suite_id: suite_id,
      }
      expect(response.status).to eq 200
      post '/threAS3/suite_runs', params: {
        suite_id: suite_id,
      }

      run_id = JSON.parse(response.body)['id']
    end

    it 'can load the suite id' do
      get "/threAS3/suite_runs/#{run_id}"
      observed = JSON.parse(response.body)['record']['suite_id']
      expect(observed).to eq suite_id
    end

    it 'can load scenario runs' do
      get "/threAS3/scenario_runs", params: {
        with_run: run_id,
      }
      expect_body(
        offset: 0,
        count: 3,
        records: [
          {
            scenario_id: scenario1_id,
            suite_run_id: run_id,
            name: 'my Scenario1',
            status: 'requested',
            result: 'unexecuted',
            steps: [
              { keyword: 'given', text: 'a scenario' },
              { keyword: 'then', text: 'something happened' },
            ]
          },
          {
            scenario_id: scenario2_id,
            suite_run_id: run_id,
            name: 'my Scenario2',
            status: 'requested',
            result: 'unexecuted',
            steps: [
              { keyword: 'given', text: 'a scenario' },
              { keyword: 'then', text: 'nothing happened' },
            ]
          },
          {
            scenario_id: scenario3_id,
            suite_run_id: run_id,
            name: 'my Scenario3',
            status: 'requested',
            result: 'unexecuted',
            steps: [
              { keyword: 'given', text: 'a third scenario' },
              { keyword: 'then', text: 'nothing happened' },
            ]
          },
        ],
        &method(:nilify_step_ids)
      )
    end

    it 'can limit scenario runs' do
      get "/threAS3/scenario_runs", params: {
        with_run: run_id,
        limit: 1,
      }
      expect_body(
        offset: 0,
        count: 3,
        records: [
          {
            scenario_id: scenario1_id,
            suite_run_id: run_id,
            name: 'my Scenario1',
            status: 'requested',
            result: 'unexecuted',
            steps: [
              { keyword: 'given', text: 'a scenario' },
              { keyword: 'then', text: 'something happened' },
            ]
          },
        ],
        &method(:nilify_step_ids)
      )
    end

    it 'can offset scenario runs' do
      get "/threAS3/scenario_runs", params: {
        with_run: run_id,
        offset: 2,
      }
      expect_body(
        offset: 2,
        count: 3,
        records: [
          {
            scenario_id: scenario3_id,
            suite_run_id: run_id,
            name: 'my Scenario3',
            status: 'requested',
            result: 'unexecuted',
            steps: [
              { keyword: 'given', text: 'a third scenario' },
              { keyword: 'then', text: 'nothing happened' },
            ]
          },
        ],
        &method(:nilify_step_ids)
      )
    end

    it 'can offset and limit scenario runs' do
      get "/threAS3/scenario_runs", params: {
        with_run: run_id,
        limit: 1,
        offset: 1,
      }
      expect_body(
        offset: 1,
        count: 3,
        records: [
          {
            scenario_id: scenario2_id,
            suite_run_id: run_id,
            name: 'my Scenario2',
            status: 'requested',
            result: 'unexecuted',
            steps: [
              { keyword: 'given', text: 'a scenario' },
              { keyword: 'then', text: 'nothing happened' },
            ]
          },
        ],
        &method(:nilify_step_ids)
      )
    end
  end

end
