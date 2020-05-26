class CreateSteps < ActiveRecord::Migration[6.0]
  def change
    create_table :steps do |t|
      t.string :keyword
      t.string :text

      t.timestamps
    end
  end
end
