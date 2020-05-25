# frozen_string_literal: true

class Suite < ApplicationRecord
  acts_as_paranoid
  audited
end
