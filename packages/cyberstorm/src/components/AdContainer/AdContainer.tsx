"use client";
import { useContext, useEffect } from "react";
import styles from "./AdContainer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/pro-solid-svg-icons";
import { Icon } from "../Icon/Icon";

interface Window {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // Add index signature
}

interface AdContainerProps {
  containerId: string;
  context: React.Context<boolean>;
}

export function AdContainer(props: AdContainerProps) {
  const { containerId, context } = props;

  const isLoaded = useContext(context);

  useEffect(() => {
    const typedWindow: Window = window;

    if (isLoaded) {
      typedWindow["nitroAds"].createAd(containerId, {
        demo: false,
        format: "display",
        refreshLimit: 0,
        refreshTime: 30,
        renderVisibleOnly: true,
        refreshVisibleOnly: true,
        sizes: [["300", "250"]],
        report: {
          enabled: true,
          wording: "Report Ad",
          position: "bottom-right",
        },
        mediaQuery: "(min-width: 1475px) and (min-height: 400px)",
      });
    }
  }, [isLoaded]);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <p className={styles.adTitle}>AD</p>
      </div>
      <div className={styles.fallback}>
        <p className={styles.adText}>
          Thunderstore development is made possible with ads.
        </p>
        <p className={styles.adThanks}>
          <Icon noWrapper inline iconClasses={styles.icon}>
            <FontAwesomeIcon icon={faHeart} />
          </Icon>
          Thanks
          <Icon noWrapper inline iconClasses={styles.icon}>
            <FontAwesomeIcon icon={faHeart} />
          </Icon>
        </p>
      </div>
      <div className={styles.content}>
        <div id={containerId} />
      </div>
    </div>
  );
}

AdContainer.displayName = "AdContainer";
