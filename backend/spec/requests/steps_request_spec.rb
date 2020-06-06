require 'rails_helper'

RSpec.describe "Steps", type: :request do
  include RequestHelper

  describe 'when it has 3 steps' do
    before :all do
      clear_database
      post '/threAS3/steps', params: {keyword: 'given', text: 'have step'}
      post '/threAS3/steps', params: {keyword: 'when', text: 'did step'}
      post '/threAS3/steps', params: {keyword: 'then', text: 'done step'}
    end

    it 'will obey an offset' do
      get '/threAS3/steps', params: { offset: 1 }
      expect_body(
        offset: 1,
        count: 3,
        records: [
          {keyword: 'then', text: 'done step'},
          {keyword: 'given', text: 'have step'},
        ]
      )
    end

    it 'will obey a limit' do
      get '/threAS3/steps', params: { limit: 2 }
      expect_body(
        offset: 0,
        count: 3,
        records: [
          {keyword: 'when', text: 'did step'},
          {keyword: 'then', text: 'done step'},
        ]
      )
    end

    it 'will obey a limit and offset' do
      get '/threAS3/steps', params: { limit: 1, offset: 1 }
      expect_body(
        offset: 1,
        count: 3,
        records: [
          {keyword: 'then', text: 'done step'},
        ]
      )
    end
  end


  ['given', 'when', 'then'].each do |keyword|
    it "can add a #{keyword} step" do
      post '/threAS3/steps', params: {
        keyword: keyword,
        text: 'a created text'
      }
      id = JSON.parse(response.body)['id']
      get "/threAS3/steps/#{id}"
      expect(response.status).to eq 200
      expect(JSON.parse(response.body)).to eq ({
        'id' => id,
        'keyword' => keyword,
        'text' => 'a created text',
      })
    end
  end

  it 'will downcase keyword' do
    post '/threAS3/steps', params: {
      keyword: 'Given',
      text: 'a created text'
    }
    id = JSON.parse(response.body)['id']
    get "/threAS3/steps/#{id}"
    expect(response.status).to eq 200
    expect(JSON.parse(response.body)).to eq ({
      'id' => id,
      'keyword' => 'given',
      'text' => 'a created text',
    })
  end

  it 'will silently ignore 403ing posts' do
    post '/threAS3/steps', params: {
      keyword: 'given',
      text: 'a created text'
    }
    first_id = JSON.parse(response.body)['id']
    post '/threAS3/steps', params: {
      keyword: 'given',
      text: 'a created text'
    }
    expect(response.status).to eq 200
    second_id = JSON.parse(response.body)['id']
    expect(second_id).to eq first_id
    get "/threAS3/steps/#{second_id}"
    expect(JSON.parse(response.body)).to eq ({
      'id' => second_id,
      'keyword' => 'given',
      'text' => 'a created text',
    })
  end

  it 'will not accept an invalid keyword' do
    post '/threAS3/steps', params: {
      keyword: 'gave',
      text: 'a created text'
    }
    expect(response.status).to eq 400
    expect(JSON.parse(response.body)).to eq ({
      'errors' => ['invalid keyword']
    })
  end

  it 'will not accept a missing keyword' do
    post '/threAS3/steps', params: {
      text: 'a created text'
    }
    expect(response.status).to eq 400
    expect(JSON.parse(response.body)).to eq ({
      'errors' => ['missing keyword']
    })
  end

  it 'will not accept missing text' do
    post '/threAS3/steps', params: {
      keyword: 'gave',
    }
    expect(response.status).to eq 400
    expect(JSON.parse(response.body)).to eq ({
      'errors' => ['missing text']
    })
  end
end
