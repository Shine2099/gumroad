import { usePage } from "@inertiajs/react";
import React from "react";

import { default as MainPageComponent, type MainPageProps } from "$app/components/Settings/MainPage";

const MainPage = () => {
  const props = usePage<MainPageProps>().props;

  return <MainPageComponent {...props} />;
};

export default MainPage;
