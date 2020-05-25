# frozen_string_literal: true

class ApplicationController < ActionController::Base
#  protect_from_forgery with: :exception
# skip_before_action :verify_authenticity_token

  attr_reader :offset, :limit, :id

  before_action :validate_offset, only: [:index]
  before_action :validate_limit, only: [:index]
  before_action :validate_id, only: [:destroy]
  protect_from_forgery with: :null_session

  private

  def validate_offset
    begin
      @offset = integer_param(:offset, 0)
    rescue StandardError
      render json: { error: 'NaN offset' }, status: 400
      return
    end
    render json: { error: 'negative offset' }, status: 400 if offset.negative?
  end

  def validate_limit
    begin
      @limit = integer_param(:limit, nil)
    rescue StandardError
      render json: { error: 'NaN limit' }, status: 400
      return
    end
    return if limit.nil? || limit >= 0

    render json: { error: 'negative limit' }, status: 400
  end

  def validate_id
    begin
      @id =  Integer(params[:id])
    rescue StandardError
      render json: { error: 'expecting integer id' }, status: 400
      return
    end
    render json: { error: 'expecting positive id' }, status: 400 if id.negative?
  end

  def integer_param(key, default)
    if params[key].nil?
      default
    else
      Integer(params[key])
    end
  end
end
