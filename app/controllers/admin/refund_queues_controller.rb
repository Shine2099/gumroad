# frozen_string_literal: true

class Admin::RefundQueuesController < Admin::BaseController
  include Admin::ListPaginatedUsers

  def show
    @title = "Refund queue"

    list_paginated_users users: User.refund_queue, template: "Admin/RefundQueues/Show"
  end
end
