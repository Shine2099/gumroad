# frozen_string_literal: true

class Users::ReviewRemindersController < ApplicationController
  before_action :authenticate_user!
  layout "inertia"

  def subscribe
    logged_in_user.update!(opted_out_of_review_reminders: false)
    render inertia: "Users/SubscribeReviewReminders"
  end

  def unsubscribe
    logged_in_user.update!(opted_out_of_review_reminders: true)
    render inertia: "Users/UnsubscribeReviewReminders"
  end
end
