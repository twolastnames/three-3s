class ScenariosController < ApplicationController
  def index
    base = Scenario
    if params[:with_suite_id].present?
      base = Suite.find(params[:with_suite_id].to_i).scenarios
    end
    
    scenarios = Concurrent::Future.execute do
      base.limit(
        limit
      ).offset(
        offset
      ).pluck(:id, :name).map do |id, name|
        { id: id, name: name }
      end
    end
    count = Concurrent::Future.execute { base.count }
    render json: { offset: offset, count: count.value, records: scenarios.value }
  end

  def destroy
    if Scenario.delete(params[:id]) < 1
      render json: { error: "no id #{params[:id]} to destroy" }, status: 404
    else
      render json: { id: params[:id] }, status: 200
    end
  end

  def create
    scenario = Scenario.create(name: params[:name])
    render json: { id: scenario.id }
  end

  def show
    scenario = Scenario.find(params[:id])
    render json: { record: {
        id: params[:id],
        name: scenario.name,
      }
    }
  end

  def update
    if params[:add_suite_id].present?
      Suite.find(
        params[:id].to_i).suites<< Suite.find(params[:add_suite_id]
      )
      return render json: {
        suite_id: params[:id].to_i, scenario_id: params[:add_suite_id]
      }
    end
    render json: {
       error: 'no support for overlay update'
    }, status: 400
  end
end
