import ReactOnRails from "react-on-rails";

import BasePage from "$app/utils/base_page";

import LoginPage from "$app/components/server-components/LoginPage";
import SignupPage from "$app/components/server-components/SignupPage";

BasePage.initialize();

ReactOnRails.default.register({ SignupPage, LoginPage });
