# frozen_string_literal: true

class Users::SubscribeReviewRemindersController < ApplicationController
  before_action :authenticate_user!
  layout "inertia"

  def show
    logged_in_user.update!(opted_out_of_review_reminders: false)
    render inertia: "Users/SubscribeReviewReminders/Show"
  end
end
