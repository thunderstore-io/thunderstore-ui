import { NewButton, NewIcon } from "@thunderstore/cyberstorm";
import { memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHandHoldingHeart,
  faDownload,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

import {
  type PackageListingDetails,
  type Team,
  type CurrentUser,
} from "@thunderstore/dapper/types";

type ActionsProps = {
  team: Team;
  listing: PackageListingDetails;
  isLiked: boolean;
  currentUser?: CurrentUser;
  packageLikeAction: (
    isLiked: boolean,
    namespace: string,
    packageName: string,
    isLoggedIn: boolean
  ) => void;
};

export const PackageActions = memo(function Actions({
  team,
  listing,
  isLiked,
  currentUser,
  packageLikeAction,
}: ActionsProps) {
  return (
    <>
      <NewButton
        primitiveType="link"
        href={listing.download_url}
        csVariant="secondary"
        rootClasses="package-listing-sidebar__download"
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faDownload} />
        </NewIcon>
        Download
      </NewButton>
      {team.donation_link ? (
        <NewButton
          primitiveType="link"
          href={team.donation_link}
          csVariant="secondary"
          csSize="big"
          csModifiers={["only-icon"]}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faHandHoldingHeart} />
          </NewIcon>
        </NewButton>
      ) : null}
      <NewButton
        primitiveType="button"
        onClick={() =>
          packageLikeAction(
            isLiked,
            listing.namespace,
            listing.name,
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
    </>
  );
});
