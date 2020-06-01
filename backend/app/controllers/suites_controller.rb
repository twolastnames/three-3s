# frozen_string_literal: true

require 'concurrent'

# TODO: utilize this query
# Audited.audit_class.where("created_at >= ?", Date.today)
#   where("action = ?", 'destroy')

class SuitesController < ApplicationController
  def index
    base = Suite
    if params[:without_scenario_id].present?
      select = 'select suite_id from scenarios_suites where scenario_id = ?'
      base = Suite.where(
        "id not in (#{select})", params[:without_scenario_id]
        )
    elsif params[:with_scenario_id].present?
      base = Scenario.find(params[:with_scenario_id].to_i).suites
    end

    suites = Concurrent::Future.execute do
      base.limit(
        limit
      ).offset(
        offset
      ).pluck(:id, :name).map do |id, name|
        { id: id, name: name }
      end
    end
    count = Concurrent::Future.execute { base.count }
    render json: { offset: offset, count: count.value, records: suites.value }
  end

  def show
    suite = Suite.find(params[:id])
    render json: { record: {
        id: params[:id],
        name: suite.name,
      }
    }
  end

  def update
    if params[:add_scenario_id].present?
      Suite.find(params[:id].to_i).scenarios << Scenario.find(
        params[:add_scenario_id]
      )
      return render json: {
        suite_id: params[:id].to_i, scenario_id: params[:add_scenario_id]
      }
    elsif params[:remove_scenario_id].present?
      Suite.find(params[:id].to_i).scenarios.delete(Scenario.find(
        params[:remove_scenario_id]
      ))
      return render json: {
        suite_id: params[:id].to_i, scenario_id: params[:add_scenario_id]
      }
    end
    render json: {
       error: 'no support for overlay update'
    }, status: 400
  end

  def create
    suite = Suite.create(name: params[:name])
    render json: { id: suite.id }
  end

  def destroy
    if Suite.delete(params[:id]) < 1
      render json: { error: "no id #{params[:id]} to destroy" }, status: 404
    else
      render json: { id: params[:id] }, status: 200
    end
  end
end
