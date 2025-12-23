# frozen_string_literal: true

class User::PasswordsController < Devise::PasswordsController
  include InertiaRendering
  layout "inertia", only: [:edit]

  def new
    e404
  end

  def create
    email = params[:user][:email]
    if EmailFormatValidator.valid?(email)
      @user = User.alive.by_email(email).first
      return head :no_content if @user&.send_reset_password_instructions
    end
    render json: { error_message: "An account does not exist with that email." }, status: :unprocessable_entity
  end

  def edit
    @reset_password_token = params[:reset_password_token]
    @user = User.find_or_initialize_with_error_by(:reset_password_token,
                                                  Devise.token_generator.digest(User, :reset_password_token, @reset_password_token))
    if @user.errors.present?
      flash[:alert] = "That reset password token doesn't look valid (or may have expired)."
      return redirect_to root_url
    end

    @title = "Reset your password"
    render inertia: "PasswordReset/Edit", props: {
      reset_password_token: @reset_password_token
    }
  end

  def update
    @reset_password_token = params[:user][:reset_password_token]
    @user = User.reset_password_by_token(params[:user])

    if @user.errors.present?
      error_message = if @user.errors[:password_confirmation].present?
        "Those two passwords didn't match."
      elsif @user.errors[:password].present?
        @user.errors.full_messages.first
      else
        "That reset password token doesn't look valid (or may have expired)."
      end
      redirect_to edit_user_password_path(reset_password_token: @reset_password_token), warning: error_message, status: :see_other
    else
      flash[:notice] = "Your password has been reset, and you're now logged in."
      @user.invalidate_active_sessions!
      sign_in @user unless @user.deleted?
      redirect_to login_path_for(@user), status: :see_other
    end
  end

  def after_sending_reset_password_instructions_path_for(_resource_name, _user)
    root_url
  end
end
