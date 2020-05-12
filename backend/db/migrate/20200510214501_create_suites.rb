# frozen_string_literal: true

class CreateSuites < ActiveRecord::Migration[5.0]
  def change
    create_table :suites do |t|
      t.string :name
      t.timestamps
    end
  end
end
