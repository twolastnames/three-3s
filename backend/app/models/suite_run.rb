# frozen_string_literal: true

class SuiteRun < ApplicationRecord
  has_many :scenario_runs
end