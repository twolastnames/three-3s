class CreateJoinTableScenariosSteps < ActiveRecord::Migration[6.0]
  def change
    create_join_table :scenarios, :steps do |t|
      t.index [:scenario_id, :step_id]
      t.index [:step_id, :scenario_id]
    end
  end
end
