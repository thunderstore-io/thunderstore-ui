"use client";
import { faUpload, faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";

import { UserDropDown } from "./UserDropDown";
import { Button, Icon, Popover, SkeletonBox } from "@thunderstore/cyberstorm";
import { AvatarButton } from "@thunderstore/cyberstorm/src/components/Avatar/AvatarButton";
import { Suspense } from "react";
import { UserActions } from "./UserActions";
import styles from "./Navigation.module.css";

export const HeaderUserNav = () => {
  const dapper = useDapper();
  const user = usePromise(dapper.getCurrentUser, []);
  const avatar = user.connections.find((c) => c.avatar !== null)?.avatar;

  return (
    <>
      {user.username ? (
        <>
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
          <li>
            <UserDropDown username={user.username} avatar={avatar} />
          </li>
        </>
      ) : (
        <li>
          <Popover
            popoverId={"navAccount"}
            popoverRootClasses={styles.navAccountPopoverRoot}
            popoverWrapperClasses={styles.navAccountPopoverWrapper}
            trigger={
              <AvatarButton
                size="small"
                popovertarget="navAccount"
                popovertargetaction="open"
              />
            }
          >
            <button
              {...{
                popovertarget: "navAccount",
                popovertargetaction: "close",
              }}
              className={styles.navAccountPopoverCloseButton}
            >
              <Icon inline noWrapper>
                <FontAwesomeIcon icon={faXmarkLarge} />
              </Icon>
            </button>
            <nav className={styles.mobileNavPopoverList}>
              <Suspense fallback={<SkeletonBox />}>
                <UserActions />
              </Suspense>
            </nav>
          </Popover>
        </li>
      )}
    </>
  );
};

HeaderUserNav.displayName = "HeaderUserNav";
