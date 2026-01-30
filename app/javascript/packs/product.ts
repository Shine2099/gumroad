import ReactOnRails from "react-on-rails";

import BasePage from "$app/utils/base_page";

import DiscoverProductPage from "$app/components/server-components/Discover/ProductPage";
import ProductPage from "$app/components/server-components/Product";
import ProductIframePage from "$app/components/server-components/Product/IframePage";
import ProfileCoffeePage from "$app/components/server-components/Profile/CoffeePage";

BasePage.initialize();
ReactOnRails.register({
  DiscoverProductPage,
  ProfileCoffeePage,

  ProductPage,
  ProductIframePage,
});
