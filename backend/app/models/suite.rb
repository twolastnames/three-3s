# frozen_string_literal: true

class Suite < ApplicationRecord
  acts_as_paranoid
  audited
  has_and_belongs_to_many :scenarios
  has_many :suite_runs
end
