# frozen_string_literal: true

class SuiteRunsController < ApplicationController
  def create
    begin
      suite = Suite.find params[:suite_id]
    rescue ActiveRecord::RecordNotFound
      return render json: {
        errors: ["expected suite_id:#{params[:suite_id]} to be a suite ID"]
      }, status: 400
    end
    run = SuiteRun.create suite_id: suite.id
    suite.scenarios.map do |scenario|
      ScenarioRun.create( suite_run_id: run.id, scenario_id: scenario.id, status: 'requested', result: 'unexecuted' )
    end
    render :json => { id: run.id }
  end

  def show
    run = SuiteRun.find params[:id]
    render :json => { record: {
        suite_id: run.suite_id,
      }
    }
  end
end
