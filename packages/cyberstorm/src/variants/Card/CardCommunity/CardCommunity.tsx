import { faBoxOpen, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Community } from "@thunderstore/dapper/types";

import styles from "./CardCommunity.module.css";
import { numberWithSpaces, formatInteger } from "../../../utils/utils";
import { Container, Icon, NewLink, Image } from "../../..";

interface Props {
  community: Community;
}

export function CardCommunity(props: Props) {
  const { community } = props;

  return (
    <Container
      csColor="surface"
      csSize="m"
      csWeight="bold"
      csVariant="primary"
      rootClasses={styles.root}
    >
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
      >
        {community.name}
      </NewLink>
      <Container rootClasses={styles.metaItemList}>
        <Container
          csVariant="accent"
          csSize="xs"
          tooltipText={`${numberWithSpaces(
            community.total_package_count
          )} Packages`}
          rootClasses={styles.metaItem}
        >
          <Icon inline>
            <FontAwesomeIcon icon={faBoxOpen} />
          </Icon>
          {formatInteger(community.total_package_count)}
        </Container>
        <Container
          csVariant="accent"
          csSize="xs"
          tooltipText={`${numberWithSpaces(
            community.total_download_count
          )} Downloads`}
          rootClasses={styles.metaItem}
        >
          <Icon inline>
            <FontAwesomeIcon icon={faDownload} />
          </Icon>
          {formatInteger(community.total_download_count)}
        </Container>
      </Container>
    </Container>
  );
}

CardCommunity.displayName = "CardCommunity";
