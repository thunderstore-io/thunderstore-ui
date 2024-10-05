import {
  faBoxOpen,
  faDownload,
  faHandSparkles,
  faFire,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Community } from "@thunderstore/dapper/types";

import styles from "./CardCommunity.module.css";
import { numberWithSpaces, formatInteger } from "../../../utils/utils";
import { NewLink, NewIcon, Image, NewTag } from "../../..";
import { Container } from "../../Container/Container";

interface Props {
  community: Community;
  isPopular?: boolean;
  isNew?: boolean;
}

export function CardCommunity(props: Props) {
  const { community, isPopular, isNew } = props;

  return (
    <Container
      csColor="surface"
      csTextStyles={["fontSizeM", "fontWeightBold"]}
      csVariant="primary"
      rootClasses={styles.root}
    >
      <Container rootClasses={styles.tag}>
        {isPopular ? (
          <NewTag dark csColor="orange">
            <NewIcon noWrapper csMode="inline">
              <FontAwesomeIcon icon={faFire} />
            </NewIcon>
            Popular
          </NewTag>
        ) : null}
        {isNew ? (
          <NewTag dark csColor="green">
            <NewIcon noWrapper csMode="inline">
              <FontAwesomeIcon icon={faHandSparkles} />
            </NewIcon>
            New
          </NewTag>
        ) : null}
      </Container>
      <NewLink
        primitiveType="cyberstormLink"
        tabIndex={-1}
        linkId="Community"
        community={community.identifier}
        title={community.name}
      >
        <Image
          src={community.cover_image_url}
          cardType="community"
          rootClasses={styles.imageWrapper}
        />
      </NewLink>
      <NewLink
        primitiveType="cyberstormLink"
        linkId="Community"
        community={community.identifier}
        rootClasses={styles.title}
        csVariant="primary"
        csTextStyles={["lineHeightAuto"]}
      >
        {community.name}
      </NewLink>
      <Container rootClasses={styles.metaItemList}>
        <Container
          csVariant="accent"
          csTextStyles={["fontSizeXS"]}
          tooltipText={`${numberWithSpaces(
            community.total_package_count
          )} Packages`}
          rootClasses={styles.metaItem}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faBoxOpen} />
          </NewIcon>
          {formatInteger(community.total_package_count)}
        </Container>
        <Container
          csVariant="accent"
          csTextStyles={["fontSizeXS"]}
          tooltipText={`${numberWithSpaces(
            community.total_download_count
          )} Downloads`}
          rootClasses={styles.metaItem}
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faDownload} />
          </NewIcon>
          {formatInteger(community.total_download_count)}
        </Container>
      </Container>
    </Container>
  );
}

CardCommunity.displayName = "CardCommunity";
