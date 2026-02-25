import {
  faDownload,
  faHandHoldingHeart,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { type ReactNode, Suspense, memo } from "react";
import { Await } from "react-router";

import { NewButton, NewIcon, ThunderstoreLogo } from "@thunderstore/cyberstorm";
import type { CurrentUser } from "@thunderstore/dapper/types";

export type TeamDetailsLike = {
  donation_link?: string | null;
};

export interface PackageActionsProps {
  downloadUrl: string;
  team: Promise<TeamDetailsLike> | TeamDetailsLike;
  /** When provided, shows the Install button. Use empty string to show disabled. */
  installUrl?: string;
  /** When true, Install button is disabled. Use when installUrl might be empty. */
  installDisabled?: boolean;
  /** Optional Details drawer for narrow layout */
  packageDetailsNarrow?: ReactNode;
  /** Optional Report button to render after actions */
  reportPackageButton?: ReactNode;
  /** Optional Like button - provide all to enable */
  isLiked?: boolean;
  currentUser?: CurrentUser;
  packageLikeAction?: (
    isLiked: boolean,
    namespace: string,
    packageName: string,
    isLoggedIn: boolean
  ) => void;
  namespace?: string;
  packageName?: string;
}

export const PackageActions = memo(function PackageActions(
  props: PackageActionsProps
) {
  const {
    downloadUrl,
    team,
    installUrl,
    installDisabled = false,
    packageDetailsNarrow,
    reportPackageButton,
    isLiked,
    currentUser,
    packageLikeAction,
    namespace,
    packageName,
  } = props;

  const showLikeButton =
    packageLikeAction != null &&
    namespace != null &&
    packageName != null &&
    isLiked !== undefined;

  return (
    <>
      {installUrl !== undefined && (
        <NewButton
          csVariant="accent"
          csSize="big"
          rootClasses="package-listing-sidebar__install"
          primitiveType="link"
          href={installUrl}
          disabled={installDisabled}
        >
          <NewIcon csMode="inline">
            <ThunderstoreLogo />
          </NewIcon>
          Install
        </NewButton>
      )}
      {packageDetailsNarrow ?? null}
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={team}>
          {(resolvedTeam) => (
            <div className="package-listing__package-actions">
              <NewButton
                primitiveType="link"
                href={downloadUrl}
                csVariant="secondary"
                rootClasses="package-listing-sidebar__download"
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon icon={faDownload} />
                </NewIcon>
                Download
              </NewButton>
              {resolvedTeam?.donation_link ? (
                <NewButton
                  primitiveType="link"
                  href={resolvedTeam.donation_link}
                  csVariant="secondary"
                  csSize="big"
                  csModifiers={["only-icon"]}
                >
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faHandHoldingHeart} />
                  </NewIcon>
                </NewButton>
              ) : null}
              {showLikeButton && (
                <NewButton
                  primitiveType="button"
                  onClick={() =>
                    packageLikeAction!(
                      isLiked!,
                      namespace!,
                      packageName!,
                      Boolean(currentUser?.username)
                    )
                  }
                  tooltipText="Like"
                  csVariant={isLiked ? "primary" : "secondary"}
                  csSize="big"
                  csModifiers={["only-icon"]}
                >
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faThumbsUp} />
                  </NewIcon>
                </NewButton>
              )}
              {reportPackageButton ?? null}
            </div>
          )}
        </Await>
      </Suspense>
    </>
  );
});
