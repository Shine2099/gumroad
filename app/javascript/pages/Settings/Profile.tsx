import { usePage } from "@inertiajs/react";
import React from "react";

import { default as ProfileSettingsPageComponent, type ProfilePageProps } from "$app/components/Settings/ProfilePage";

const ProfileSettingsPage = () => {
  const props = usePage<ProfilePageProps>().props;

  return <ProfileSettingsPageComponent {...props} />;
};

export default ProfileSettingsPage;
