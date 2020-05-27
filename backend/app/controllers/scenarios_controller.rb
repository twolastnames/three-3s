class ScenariosController < ApplicationController
  def index
    scenarios = Concurrent::Future.execute do
      Scenario.limit(
        limit
      ).offset(
        offset
      ).pluck(:id, :name).map do |id, name|
        { id: id, name: name }
      end
    end
    count = Concurrent::Future.execute { Scenario.count }
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
    render json: {}
  end
end
