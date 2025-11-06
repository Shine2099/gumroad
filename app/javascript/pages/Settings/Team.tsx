import { usePage } from "@inertiajs/react";
import React from "react";

import { default as TeamPageComponent, type TeamPageProps } from "$app/components/Settings/TeamPage";

const TeamPage = () => {
  const props = usePage<TeamPageProps>().props;

  return <TeamPageComponent {...props} />;
};

export default TeamPage;
