# frozen_string_literal: true

require 'rails_helper'

require 'json'

module SuitesHelper
end

RSpec.describe 'Suites', type: :request do
  include RequestHelper

  before :all do
    clear_database
  end

  it 'can retreive an empty index' do
    get '/threAS3/suites'
    expect_body(offset: 0, count: 0, records: [])
  end

  it 'can retreive an index with a value' do
    post '/threAS3/suites', params: {name: 'my suite'}
    get '/threAS3/suites'
    expect_body(
      offset: 0,
      count: 1,
      records: [{ name: 'my suite' }]
    )
  end

  it '400s with non integer offset' do
    get '/threAS3/suites', params: { offset: 'hello' }
    expect(response).to have_http_status(400)
  end

  it '400s with non integer limit' do
    get '/threAS3/suites', params: { limit: 'world' }
    expect(response).to have_http_status(400)
  end

  it '400s with negative offset' do
    get '/threAS3/suites', params: { offset: '-7' }
    expect(response).to have_http_status(400)
  end

  it '400s with negative limit' do
    get '/threAS3/suites', params: { limit: -5 }
    expect(response).to have_http_status(400)
  end

  describe 'when it has 3 suites' do
    before :all do
      clear_database
      post '/threAS3/suites', params: {name: 'my suite1'}
      post '/threAS3/suites', params: {name: 'my suite2'}
      post '/threAS3/suites', params: {name: 'my suite3'}
    end

    it 'can retreive a all values' do
      get '/threAS3/suites'
      expect_body(
        offset: 0,
        count: 3,
        records: [
          { name: 'my suite1' },
          { name: 'my suite2' },
          { name: 'my suite3' }
        ]
      )
    end

    it 'can retrieve a single record' do
      get "/threAS3/suites/#{Suite.second.id}"
      expect_body(
        record: {
          name: 'my suite2'
        }
      )
    end

    it 'will obey an offset' do
      get '/threAS3/suites', params: { offset: 1 }
      expect_body(
        offset: 1,
        count: 3,
        records: [
          { name: 'my suite2' },
          { name: 'my suite3' }
        ]
      )
    end

    it 'will obey a limit' do
      get '/threAS3/suites', params: { limit: 2 }
      expect_body(
        offset: 0,
        count: 3,
        records: [
          { name: 'my suite1' },
          { name: 'my suite2' }
        ]
      )
    end

    it 'will obey a limit and offset' do
      get '/threAS3/suites', params: { limit: 1, offset: 1 }
      expect_body(
        offset: 1,
        count: 3,
        records: [
          { name: 'my suite2' }
        ]
      )
    end
  end

  describe 'modifying' do
    before :each do
      clear_database
    end

    it 'can create a suite' do
      # TODO: fix this suite
      post '/threAS3/suites', params: { name: 'created suite' }
      expect(Suite.find_by(name: 'created suite')).to be
    end

     it 'returns the created ID' do
      post '/threAS3/suites', params: { name: 'created suite' }
      expect(JSON.parse(response.body).keys).to eq ['id']
    end

    it '400s when creating a nameless suite' do
      # TODO: fix this test
      post '/threAS3/suites', params: { name: 'created suite' }
      expect(Suite.find_by(name: 'created suite')).to be
    end

    it 'can delete a suite' do
      post '/threAS3/suites', params: {name: 'delete me'}
      id = JSON.parse(response.body)['id']
      delete "/threAS3/suites/#{id}"
      expect(Suite.where(id: id)).to eq([])
    end

    it '400s deleting a suite with in a non-integer id' do
      delete '/threAS3/suites/hello'
      expect(response).to have_http_status(400)
    end

    it '400s deleting a suite with a negative id' do
      delete '/threAS3/suites/hello'
      expect(response).to have_http_status(400)
    end

    it '404s deleting a suite that does not exist' do
      delete '/threAS3/suites/5'
      expect(response).to have_http_status(404)
    end
  end

  it 'must have "_what" if "_id" exists' do
    post '/threAS3/suites', params: {name: 'my suites1'}
    suite_id = JSON.parse(response.body)["id"]
    put "/threAS3/suites/#{suite_id}", params: {add_id:5}
    expect(response.code).to eq '400'
  end

  it 'can not add and remove' do
    post '/threAS3/suites', params: {name: 'my suites1'}
    suite_id = JSON.parse(response.body)["id"]
    put "/threAS3/suites/#{suite_id}", params: {
      add_what: 'scenarios', add_id: 5, remove_what: 'scenarios', remove_id: 7
    }
    expect(response.code).to eq '400'
  end

  it 'can filter by scenarios' do
    clear_database
    post '/threAS3/scenarios', params: {name: 'my scenario1'}
    scenario_id = JSON.parse(response.body)["id"].to_i
    post '/threAS3/suites', params: {name: 'my suites1'}
    post '/threAS3/suites', params: {name: 'my suites2'}
    suite_id = JSON.parse(response.body)["id"]
    put "/threAS3/suites/#{suite_id}", params: { add_scenario_id: scenario_id }
    get "/threAS3/suites", params: { with_scenario_id: scenario_id}
    expect_body(
      offset: 0,
      count: 1,
      records: [{ name: 'my suites2' }]
    )
  end
end
