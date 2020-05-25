class AddDeletedAtToSuites < ActiveRecord::Migration[6.0]
  def change
    add_column :suites, :deleted_at, :datetime
    add_index :suites, :deleted_at
  end
end
