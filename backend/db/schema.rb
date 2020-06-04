# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2020_06_03_024145) do

  create_table "audits", force: :cascade do |t|
    t.integer "auditable_id"
    t.string "auditable_type"
    t.integer "associated_id"
    t.string "associated_type"
    t.integer "user_id"
    t.string "user_type"
    t.string "username"
    t.string "action"
    t.text "audited_changes"
    t.integer "version", default: 0
    t.string "comment"
    t.string "remote_address"
    t.string "request_uuid"
    t.datetime "created_at"
    t.index ["associated_type", "associated_id"], name: "associated_index"
    t.index ["auditable_type", "auditable_id", "version"], name: "auditable_index"
    t.index ["created_at"], name: "index_audits_on_created_at"
    t.index ["request_uuid"], name: "index_audits_on_request_uuid"
    t.index ["user_id", "user_type"], name: "user_index"
  end

  create_table "scenarios", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_scenarios_on_deleted_at"
  end

  create_table "scenarios_steps", id: false, force: :cascade do |t|
    t.integer "scenario_id", null: false
    t.integer "step_id", null: false
    t.integer "position"
    t.index ["scenario_id", "step_id"], name: "index_scenarios_steps_on_scenario_id_and_step_id"
    t.index ["step_id", "scenario_id"], name: "index_scenarios_steps_on_step_id_and_scenario_id"
  end

  create_table "scenarios_suites", id: false, force: :cascade do |t|
    t.integer "scenario_id", null: false
    t.integer "suite_id", null: false
    t.index ["scenario_id", "suite_id"], name: "index_scenarios_suites_on_scenario_id_and_suite_id"
    t.index ["suite_id", "scenario_id"], name: "index_scenarios_suites_on_suite_id_and_scenario_id"
  end

  create_table "steps", force: :cascade do |t|
    t.string "keyword"
    t.string "text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["text", "keyword"], name: "index_steps_on_text_and_keyword", unique: true
  end

  create_table "suites", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.datetime "deleted_at"
    t.index ["deleted_at"], name: "index_suites_on_deleted_at"
  end

end
