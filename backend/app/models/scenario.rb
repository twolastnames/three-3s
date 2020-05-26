class Scenario < ApplicationRecord
  acts_as_paranoid
  audited
  has_and_belongs_to_many :suites
  has_and_belongs_to_many :steps
end
