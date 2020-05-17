# frozen_string_literal: true

require 'rails_helper'

require 'json'

module SuitesHelper
end

RSpec.describe 'Suites', type: :request do
  include SuitesHelper

  before :all do
    Suite.delete_all
  end

  it 'can retreive an empty index' do
    get '/threAS3/suites'
    expect_body(offset: 0, count: 0, suites: [])
  end

  it 'can retreive an index with a value' do
    Suite.create(name: 'my suite')
    get '/threAS3/suites'
    expect_body(
      offset: 0,
      count: 1,
      suites: [{ name: 'my suite' }]
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
      Suite.delete_all
      Suite.create(name: 'my suite1')
      Suite.create(name: 'my suite2')
      Suite.create(name: 'my suite3')
    end

    it 'can retreive a all values' do
      get '/threAS3/suites'
      expect_body(
        offset: 0,
        count: 3,
        suites: [
          { name: 'my suite1' },
          { name: 'my suite2' },
          { name: 'my suite3' }
        ]
      )
    end

    it 'will obey an offset' do
      get '/threAS3/suites', params: { offset: 1 }
      expect_body(
        offset: 1,
        count: 3,
        suites: [
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
        suites: [
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
        suites: [
          { name: 'my suite2' }
        ]
      )
    end
  end

  describe 'modifying' do
    before :each do
      Suite.delete_all
    end

    it 'can create a suite' do
      post '/threAS3/suites', params: { name: 'created suite' }
      expect(Suite.find_by(name: 'created suite')).to be
    end

    it '400s when creating a nameless suite' do
      post '/threAS3/suites', params: { name: 'created suite' }
      expect(Suite.find_by(name: 'created suite')).to be
    end

    it 'can delete a suite' do
      id = Suite.create(name: 'delete me').id
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
end
