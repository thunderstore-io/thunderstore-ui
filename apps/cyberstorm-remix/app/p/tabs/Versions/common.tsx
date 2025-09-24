import { NewAlert } from "@thunderstore/cyberstorm";
import { memo } from "react";

export const ModManagerBanner = memo(function ModManagerBanner() {
  return (
    <NewAlert csVariant="info">
      Please note that the install buttons only work if you have compatible
      client software installed, such as the{" "}
      <a href="https://www.overwolf.com/app/Thunderstore-Thunderstore_Mod_Manager">
        Thunderstore Mod Manager.
      </a>{" "}
      Otherwise use the zip download links instead.
    </NewAlert>
  );
});
