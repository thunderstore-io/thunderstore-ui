import { ProfilePanel } from "../../ProfilePanel/ProfilePanel";

/**
 * Cyberstorm TwitchPanelLayout Layout
 */
export function TwitchProfilePanelLayout() {
  const profile = getProfileData();
  return <ProfilePanel profile={profile} />;
}

TwitchProfilePanelLayout.displayName = "ProfilePanelLayout";
TwitchProfilePanelLayout.defaultProps = {};

function getProfileData() {
  return {
    code: "TEST_CODE",
    name: "TEST_NAME",
    mods: [
      { name: "TEST_MOD_NAME_1", version: "0.0.1", url: "example.com" },
      { name: "TEST_MOD_NAME_2", version: "0.0.2", url: "example.com" },
      { name: "TEST_MOD_NAME_3", version: "0.0.3", url: "example.com" },
    ],
  };
}
