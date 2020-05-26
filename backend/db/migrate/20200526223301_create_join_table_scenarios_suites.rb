class CreateJoinTableScenariosSuites < ActiveRecord::Migration[6.0]
  def change
    create_join_table :scenarios, :suites do |t|
      t.index [:scenario_id, :suite_id]
      t.index [:suite_id, :scenario_id]
    end
  end
end
