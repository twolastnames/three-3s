class ScenariosStep < ApplicationRecord
  belongs_to :steps, optional: true
  belongs_to :scenarios, optional: true
end
