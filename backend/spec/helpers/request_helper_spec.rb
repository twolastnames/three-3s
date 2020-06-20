# frozen_string_literal: true

require 'rails_helper'

module RequestHelper
  def nilify_ids(array, key = :id)
    seen = Set.new
    array.map do |element|
      expect(seen).not_to include(element[key])
      expect(element[key]).to_not eq nil
      seen << element[key]
      element.delete key
    end
  end

  def expect_body(expected = {})
    body = JSON.parse(response.body, symbolize_names: true)
    nilify_ids(body[:records]) unless body[:records].nil?
    nilify_ids([body[:record]]) unless body[:record].nil?
    expect(response.content_type).to eq('application/json; charset=utf-8')
    expect(body).to eq(expected)
  end

  def clear_database
    Suite.delete_all
    Scenario.delete_all
    Step.delete_all
  end
end
