# frozen_string_literal: true

class ApplicationController < ActionController::Base

  attr_reader :offset, :limit, :id

  before_action :validate_offset, only: [:index]
  before_action :validate_limit, only: [:index]
  before_action :validate_id, only: [:destroy, :show, :update]
  before_action :validate_allowed_association, only: [:update, :index]
  skip_before_action :verify_authenticity_token

  private

  def validate_allowed_association
    operations = %w(with without add remove)
    data_types = %w(step scenario suite run)
    found = nil
    operations.each do |operation|
      data_types.each do |data_type|
        param = "#{operation}_#{data_type}_id"
        next if params[param].nil?
        begin
          Integer(params[param])
          return render json: {
            error: "can not have both '#{data_type}' and '#{found}' params",
          }, status: 400 unless found.nil?
          found = data_type
        rescue StandardError
          return render json: {
            error: "expected integer for parm '#{param}'",
          }, status: 400
        end
      end
    end
  end

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
