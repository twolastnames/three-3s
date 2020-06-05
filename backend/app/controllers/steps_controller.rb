class StepsController < ApplicationController
  def index
    steps = Concurrent::Future.execute do
      Step.limit(
        limit
      ).offset(
        offset
      ).pluck(:id, :keyword, :text).map do |id, keyword, text|
        { id: id, keyword: keyword, text: text }
      end
    end
    count = Concurrent::Future.execute { Step.count }
    render json: { offset: offset, count: count.value, records: steps.value }
  end

  def create
    if params[:text].nil?
      return render json: {errors: ['missing text']}, status: 400
    end
    if params[:keyword].nil?
      return render json: {errors: ['missing keyword']}, status: 400
    end
    if params[:keyword].present?
      unless ['given', 'when', 'then'].include? params[:keyword].downcase
        return render json: {errors: ['invalid keyword']}, status: 400
      end
    end
    Step.transaction do
      cased_keyword = params[:keyword].downcase
      found = Step.find_by keyword: cased_keyword, text: params[:text]
      return render json: {id: found.id}, status: 200 unless found.nil?
      created = Step.create! keyword: cased_keyword, text: params[:text]
      render json: {id: created.id}, status: 200
    end
  end

  def show
    step = Step.find(params[:id])
    render json: {keyword: step.keyword, text: step.text, id: step.id }
  end
end
