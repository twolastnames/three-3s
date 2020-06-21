class AddSuiteRun < ActiveRecord::Migration[6.0]
  def change
    create_table :suite_runs do |t|
      t.integer :suite_id
    end
  end
end
