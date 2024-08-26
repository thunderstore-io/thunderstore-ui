import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as Button from "../Button/";
import { UserDropDown } from "./UserDropDown";
import { CurrentUser } from "@thunderstore/dapper/types";

export const HeaderUserNav = (props: { user: CurrentUser }) => {
  const avatar = props.user.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <>
      {props.user.username ? (
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
        <UserDropDown username={props.user.username} avatar={avatar} />
      </li>
    </>
  );
};

HeaderUserNav.displayName = "HeaderUserNav";
