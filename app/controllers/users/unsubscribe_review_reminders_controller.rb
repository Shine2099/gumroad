# frozen_string_literal: true

class Users::UnsubscribeReviewRemindersController < ApplicationController
  before_action :authenticate_user!
  layout "inertia"

  def show
    logged_in_user.update!(opted_out_of_review_reminders: true)
    render inertia: "Users/UnsubscribeReviewReminders/Show"
  end
end
