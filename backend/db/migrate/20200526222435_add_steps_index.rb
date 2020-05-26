class AddStepsIndex < ActiveRecord::Migration[6.0]
  def change
    add_index :steps, [:text, :keyword], unique: true
  end
end
