import { faDownload } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

import { NewAlert, NewButton, NewIcon } from "@thunderstore/cyberstorm";
import { ThunderstoreLogo } from "@thunderstore/cyberstorm";

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

export const DownloadLink = memo(function DownloadLink(props: {
  download_url: string;
}) {
  return (
    <NewButton
      csVariant="secondary"
      csModifiers={["ghost"]}
      csSize="small"
      primitiveType="link"
      href={props.download_url}
    >
      <NewIcon noWrapper csMode="inline">
        <FontAwesomeIcon icon={faDownload} />
      </NewIcon>
      Download
    </NewButton>
  );
});

export const InstallLink = memo(function InstallLink(props: {
  install_url: string;
}) {
  return (
    <NewButton
      csVariant="accent"
      csSize="small"
      primitiveType="link"
      href={props.install_url}
    >
      <NewIcon csMode="inline">
        <ThunderstoreLogo />
      </NewIcon>
      Install
    </NewButton>
  );
});
