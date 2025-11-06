# frozen_string_literal: true

class Settings::BaseController < Sellers::BaseController
  layout "inertia"

  # Share common data across all settings pages
  inertia_share do
    {
      settings: {
        pages: SettingsPresenter.new(pundit_user:).pages
      }
    }
  end

  private
    def settings_presenter
      @settings_presenter ||= SettingsPresenter.new(pundit_user:)
    end
end

