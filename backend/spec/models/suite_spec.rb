# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Suite, type: :model do
  it 'can have many scenarios' do
    suite = Suite.new name: 'my suite name'
    scenario = Scenario.new name: 'my scenario name'
    scenario.save
    suite.save
    suite.scenarios << scenario
    suite.save
    suite = Suite.find_by name: 'my suite name'
    expect(suite.scenarios.first.name).to eq('my scenario name')
  end
end
