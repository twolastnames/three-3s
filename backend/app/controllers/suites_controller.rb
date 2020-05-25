# frozen_string_literal: true

require 'concurrent'

class SuitesController < ApplicationController
  def index
    suites = Concurrent::Future.execute do
      Suite.limit(
        limit
      ).offset(
        offset
      ).pluck(:id, :name).map do |id, name|
        { id: id, name: name }
      end
    end
    count = Concurrent::Future.execute { Suite.count }
    render json: { offset: offset, count: count.value, records: suites.values }
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
