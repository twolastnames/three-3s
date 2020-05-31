require 'rails_helper'

require 'json'

RSpec.describe "Scenarios", type: :request do
  include RequestHelper

  before :all do
    Scenario.delete_all
  end

  it 'can retreive an empty index' do
    get '/threAS3/scenarios'
    expect_body(offset: 0, count: 0, records: [])
  end

  it 'can retreive an index with a value' do
    Scenario.create(name: 'my Scenario')
    get '/threAS3/scenarios'
    expect_body(
      offset: 0,
      count: 1,
      records: [{ name: 'my Scenario' }]
    )
  end

  it '400s with non integer offset' do
    get '/threAS3/scenarios', params: { offset: 'hello' }
    expect(response).to have_http_status(400)
  end

  it '400s with non integer limit' do
    get '/threAS3/scenarios', params: { limit: 'world' }
    expect(response).to have_http_status(400)
  end

  it '400s with negative offset' do
    get '/threAS3/scenarios', params: { offset: '-7' }
    expect(response).to have_http_status(400)
  end

  it '400s with negative limit' do
    get '/threAS3/scenarios', params: { limit: -5 }
    expect(response).to have_http_status(400)
  end

  describe 'when it has 3 suites' do
    before :all do
      clear_database
      post '/threAS3/scenarios', params: {name: 'my Scenario1'}
      post '/threAS3/scenarios', params: {name: 'my Scenario2'}
      post '/threAS3/scenarios', params: {name: 'my Scenario3'}
    end

    it 'can retreive a all values' do
      get '/threAS3/scenarios'
      expect_body(
        offset: 0,
        count: 3,
        records: [
          { name: 'my Scenario1' },
          { name: 'my Scenario2' },
          { name: 'my Scenario3' }
        ]
      )
    end

    it 'can retrieve a single record' do
      get "/threAS3/scenarios/#{Scenario.second.id}"
      expect_body(
        record: {
          name: 'my Scenario2'
        }
      )
    end

    it 'will obey an offset' do
      get '/threAS3/scenarios', params: { offset: 1 }
      expect_body(
        offset: 1,
        count: 3,
        records: [
          { name: 'my Scenario2' },
          { name: 'my Scenario3' }
        ]
      )
    end

    it 'will obey a limit' do
      get '/threAS3/scenarios', params: { limit: 2 }
      expect_body(
        offset: 0,
        count: 3,
        records: [
          { name: 'my Scenario1' },
          { name: 'my Scenario2' }
        ]
      )
    end

    it 'will obey a limit and offset' do
      get '/threAS3/scenarios', params: { limit: 1, offset: 1 }
      expect_body(
        offset: 1,
        count: 3,
        records: [
          { name: 'my Scenario2' }
        ]
      )
    end
  end

  describe 'modifying' do
    before :each do
      Suite.delete_all
    end

    it 'can create a Scenario' do
      post '/threAS3/scenarios', params: { name: 'created Scenario' }
      expect(Scenario.find_by(name: 'created Scenario')).to be
    end

     it 'returns the created ID' do
      post '/threAS3/scenarios', params: { name: 'created Scenario' }
      expect(JSON.parse(response.body).keys).to eq ['id']
    end

    it '400s when creating a nameless Scenario' do
      post '/threAS3/scenarios', params: { name: 'created Scenario' }
      expect(Scenario.find_by(name: 'created Scenario')).to be
    end

    it 'can delete a Scenario' do
      id = Scenario.create(name: 'delete me').id
      delete "/threAS3/scenarios/#{id}"
      expect(Scenario.where(id: id)).to eq([])
    end

    it '400s deleting a Scenario with in a non-integer id' do
      delete '/threAS3/scenarios/hello'
      expect(response).to have_http_status(400)
    end

    it '400s deleting a Scenario with a negative id' do
      delete '/threAS3/scenarios/hello'
      expect(response).to have_http_status(400)
    end

    it '404s deleting a Scenario that does not exist' do
      delete '/threAS3/scenarios/5'
      expect(response).to have_http_status(404)
    end
  end

  it 'can filter by suite' do
    clear_database
    post '/threAS3/scenarios', params: {name: 'my scenario1'}
    post '/threAS3/scenarios', params: {name: 'my scenario2'}
    scenario_id = JSON.parse(response.body)["id"]
    post '/threAS3/suites', params: {name: 'my suites1'}
    suite_id = JSON.parse(response.body)["id"]
    put "/threAS3/suites/#{suite_id}", params: {
      add_scenario_id: scenario_id
    }
    get "/threAS3/scenarios", params: { with_suite_id: suite_id }
    expect_body(
      offset: 0,
      count: 1,
      records: [{ name: 'my scenario2' }],
    )
  end  
end
