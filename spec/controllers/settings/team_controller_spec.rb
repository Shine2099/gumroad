# frozen_string_literal: true

require "spec_helper"
require "inertia_rails/rspec"

describe Settings::TeamController, inertia: true do
  render_views

  let(:user) { create(:user) }

  before do
    sign_in user
  end

  describe "GET show" do
    before do
      get :show
    end

    it "returns successful response with Inertia page data" do
      expect(response).to be_successful
      expect(inertia.component).to eq("Settings/Team")
      expect(inertia.props[:settings_pages]).to be_an(Array)
    end

    it "includes team member information" do
      expect(inertia.props).to include(
        member_infos: be_an(Array),
        can_invite_member: be_in([true, false])
      )
    end
  end

end
