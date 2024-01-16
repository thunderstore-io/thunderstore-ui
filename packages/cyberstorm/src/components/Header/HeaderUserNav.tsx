"use client";
import { faUpload } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import * as Button from "../Button/";
import { UserDropDown } from "./UserDropDown";

export const HeaderUserNav = () => {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <>
      {user.username ? (
        <li>
          {/* TODO: This is a bit bad, since old upload pages exist on per community basis. Good enough until new upload page is deployed. */}
          {/* When new upload page is deployed change to use PackageUploadLink instead */}
          <a href="/package/create/" key="old_upload">
            <Button.Root
              paddingSize="mediumSquare"
              colorScheme="transparentAccent"
              tooltipText="Upload"
            >
              <Button.ButtonIcon>
                <FontAwesomeIcon icon={faUpload} />
              </Button.ButtonIcon>
            </Button.Root>
          </a>
        </li>
      ) : null}
      <li>
        <UserDropDown username={user.username} avatar={avatar} />
      </li>
    </>
  );
};

HeaderUserNav.displayName = "HeaderUserNav";
