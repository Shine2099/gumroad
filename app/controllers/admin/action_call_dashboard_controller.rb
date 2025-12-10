# frozen_string_literal: true

class Admin::ActionCallDashboardController < Admin::BaseController
  def index
    @title = "Action Call Dashboard"

    render inertia: "Admin/ActionCallDashboard/Index",
           props: {
             admin_action_call_infos: AdminActionCallInfo.select(:id, :controller_name, :action_name, :call_count)
                                                         .order(call_count: :desc, controller_name: :asc, action_name: :asc)
                                                         .as_json(only: %i[id controller_name action_name call_count])
           }
  end
end
