import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  type AvatarSizes,
  type AvatarVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

import { NewIcon, type PrimitiveComponentDefaultProps } from "../..";
import { classnames, componentClasses } from "../../utils/utils";
import "./Avatar.css";

export interface AvatarProps extends PrimitiveComponentDefaultProps {
  csVariant?: AvatarVariants;
  csSize?: AvatarSizes;
  src?: string | null;
  username: string | null;
}

export function Avatar(props: AvatarProps) {
  const {
    src,
    username,
    rootClasses,
    csVariant = "default",
    csSize = "medium",
    ...forwardedProps
  } = props;

  if (username) {
    return (
      <div
        {...forwardedProps}
        className={classnames(
          "avatar",
          ...componentClasses("avatar", csVariant, csSize, undefined),
          rootClasses
        )}
      >
        {src ? (
          <img src={src} alt="" className="avatar__image" />
        ) : (
          <div className="avatar__image avatar__placeholder">
            {username ? username.charAt(0).toUpperCase() : "U"}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <NewIcon csMode="inline" noWrapper rootClasses="avatar__placeholder-root">
        <FontAwesomeIcon icon={faUser} />
      </NewIcon>
    );
  }
}

Avatar.displayName = "Avatar";
