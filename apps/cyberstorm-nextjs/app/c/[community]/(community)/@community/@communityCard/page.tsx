"use client";
import styles from "./CommunityCard.module.css";
import {
  Button,
  CollapsibleText,
  ImageWithFallback,
  MetaItem,
  Title,
} from "@thunderstore/cyberstorm";
import { formatInteger } from "@thunderstore/cyberstorm/src/utils/utils";
import { useDapper } from "@thunderstore/dapper";
import { usePromise } from "@thunderstore/use-promise";
import { faDiscord } from "@fortawesome/free-brands-svg-icons";
import { faBoxOpen, faDownload } from "@fortawesome/free-solid-svg-icons";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Page({ params }: { params: { community: string } }) {
  const dapper = useDapper();
  const community = usePromise(dapper.getCommunity, [params.community]);

  return (
    <div className={styles.root}>
      <div className={styles.image}>
        <ImageWithFallback src={community.cover_image_url} type="community" />
      </div>
      <div className={styles.info}>
        <Title text={community.name} />
        {community.description ? (
          <CollapsibleText text={community.description} maxLength={85} />
        ) : null}
        <div className={styles.meta}>
          {[
            <MetaItem
              key="meta-packages"
              label={`${formatInteger(community.total_package_count)} packages`}
              icon={<FontAwesomeIcon icon={faBoxOpen} />}
              colorScheme="accent"
              size="bold_large"
            />,
            <MetaItem
              key="meta-downloads"
              label={`${formatInteger(
                community.total_download_count
              )} downloads`}
              icon={<FontAwesomeIcon icon={faDownload} />}
              colorScheme="accent"
              size="bold_large"
            />,
            community.discord_url ? (
              <a key="meta-link" href="{community.discord_url}">
                <Button.Root colorScheme="transparentPrimary">
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faDiscord} />
                  </Button.ButtonIcon>
                  <Button.ButtonLabel>Join our community</Button.ButtonLabel>
                  <Button.ButtonIcon>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                  </Button.ButtonIcon>
                </Button.Root>
              </a>
            ) : null,
          ]}
        </div>
      </div>
    </div>
  );
}
