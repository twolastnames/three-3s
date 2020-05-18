# frozen_string_literal: true

class SuitesController < ApplicationController
  def index
    count = Suite.count
    suites = Suite.limit(
      limit
    ).offset(
      offset
    ).pluck(:id, :name).map do |id, name|
      { id: id, name: name }
    end
    render json: { offset: offset, count: count, records: suites }
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
