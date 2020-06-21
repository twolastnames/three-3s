class AddScenarioRuns < ActiveRecord::Migration[6.0]
  def change
    create_table :scenario_runs do |t|
      t.integer :suite_run_id
      t.integer :scenario_id
      t.string :status
      t.string :result
    end
    add_index :scenario_runs, :scenario_id, unique: false
  end
end
