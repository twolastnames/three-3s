# frozen_string_literal: true

class ScenarioRunsController < ApplicationController
  def index
    base = ScenarioRun
    if params[:with_run].present?
      base = ScenarioRun.where 'suite_run_id = ?', params[:with_run]
    end
    scenario_runs = Concurrent::Future.execute { index_data(base) }
    count = Concurrent::Future.execute { base.count }
    with_steps = scenario_runs.value.map do |scenario_run|
      Concurrent::Future.execute { scenario_to_run(scenario_run) }
    end
    records = with_steps.map(&:value)
    render json: {
      offset: offset,
      count: count.value,
      records: records,
    }
  end

  private

  def scenario_to_run(scenario_run)
    scenario = Scenario.find(scenario_run[:scenario_id])
    scenario_run[:name] = scenario.name
    scenario_run[:steps] = scenario.ordered_steps.pluck(
      :id, :keyword, :text
    ).map do |id, keyword, text|
      { id: id, keyword: keyword, text: text }
    end
    scenario_run
  end

  def index_data(base)
      base.limit(
        limit
      ).offset(
        offset
      ).pluck(
        :id, :status, :result, :scenario_id, :suite_run_id
      ).map(&method(:scenario_run_to_object))
   end

  def scenario_run_to_object(arguments)
    id, status, result, scenario_id, suite_run_id = arguments
    {
      id: id,
      status: status,
      result: result,
      scenario_id: scenario_id,
      suite_run_id: suite_run_id,
    }
  end
end
