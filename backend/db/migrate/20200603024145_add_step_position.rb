class AddStepPosition < ActiveRecord::Migration[6.0]
  def change
    add_column :scenarios_steps, :position, :integer
  end
end
