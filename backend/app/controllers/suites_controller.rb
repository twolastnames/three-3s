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
    render json: { offset: offset, count: count, suites: suites }
  end

  def create
    Suite.create(name: params[:name])
  end

  def destroy
    if Suite.delete(params[:id]) < 1
      render json: { error: "no id #{params[:id]} to destroy" }, status: 404
    else
      render json: { id: params[:id] }, status: 200
    end
  end
end
