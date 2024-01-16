"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { classnames } from "../../utils/utils";
import styles from "./Avatar.module.css";
import React, { PropsWithChildren, useRef } from "react";
import { faUser } from "@fortawesome/pro-solid-svg-icons";
import { Icon } from "../Icon/Icon";

export interface AvatarButtonProps {
  src?: string | null;
  size?: "small" | "medium" | "large";
  colorScheme?: "default";
  username?: string | null;
  icon?: JSX.Element;
}

/**
 * Cyberstorm AvatarButton component
 */
export const AvatarButton = React.forwardRef<
  HTMLButtonElement,
  AvatarButtonProps
>((props: PropsWithChildren<AvatarButtonProps>, forwardedRef) => {
  const {
    src,
    colorScheme,
    size = "medium",
    username,
    icon,
    ...forwardedProps
  } = props;

  const fallbackRef = useRef(null);
  const ref = forwardedRef || fallbackRef;

  if (src) {
    return (
      <button
        className={classnames(styles.root, getSize(size))}
        {...forwardedProps}
        ref={ref}
      >
        <img
          src={src}
          className={classnames(styles.image, getSize(size))}
          alt=""
        />
      </button>
    );
  }
  if (username) {
    return (
      <button
        className={classnames(styles.root, getSize(size))}
        {...forwardedProps}
        ref={ref}
      >
        <div
          className={classnames(
            styles.image,
            styles.placeholder,
            styles.placeholderLetter
          )}
        >
          {username.charAt(0).toUpperCase()}
        </div>
      </button>
    );
  } else {
    return (
      <button
        className={classnames(styles.root, getSize(size))}
        {...forwardedProps}
        ref={ref}
      >
        <div
          className={classnames(
            styles.image,
            styles.placeholder,
            styles.placeholderIcon
          )}
        >
          <Icon inline>
            <FontAwesomeIcon icon={faUser} />
          </Icon>
        </div>
      </button>
    );
  }
});

AvatarButton.displayName = "AvatarButton";

const getSize = (scheme: AvatarButtonProps["size"] = "medium") => {
  return {
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
  }[scheme];
};
