# frozen_string_literal: true

class Admin::Users::Products::BaseController < Admin::Users::BaseController
  include Admin::FetchProduct

  before_action :fetch_user
  before_action :fetch_product
end
