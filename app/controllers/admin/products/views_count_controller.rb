# frozen_string_literal: true

class Admin::Products::ViewsCountController < Admin::Products::BaseController
  def show
    render json: { review_count: @product.number_of_views }
  end
end
