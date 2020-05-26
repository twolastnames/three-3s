# frozen_string_literal: true

require 'rails_helper'

module SuitesHelper
  def nilify_ids(array)
    seen = Set.new
    array.map do |element|
      expect(seen).not_to include(element[:id])
      seen << element[:id]
      element.delete :id
    end
  end

  def expect_body(expected = {})
    body = JSON.parse(response.body, symbolize_names: true)
    nilify_ids(body[:records]) unless body[:records].nil?
    nilify_ids([body[:record]]) unless body[:record].nil?
    expect(response.content_type).to eq('application/json; charset=utf-8')
    expect(body).to eq(expected)
  end
end
