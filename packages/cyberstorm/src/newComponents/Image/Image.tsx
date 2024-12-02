import { faBan, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Image.css";
import { classnames, componentClasses } from "../../utils/utils";
import { Frame, FrameWindowProps } from "../../primitiveComponents/Frame/Frame";
import { NewIcon } from "../..";
import React from "react";
import { ImageVariants } from "@thunderstore/cyberstorm-theme/src/components";

interface ImageProps extends Omit<FrameWindowProps, "primitiveType"> {
  src: string | null;
  /** Type of the image defines the icon used as the fallback. */
  cardType: "community" | "package";
  /** Alt text for the image. Leave empty for decorative images. */
  alt?: string;
  /** Force 1:1 aspect ratio */
  square?: boolean;
  csVariant?: ImageVariants;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
}

// TODO: Needs a storybook story
/**
 * Show the image, or use predefined icon as the fallback.
 */
export const Image = React.forwardRef<HTMLDivElement, ImageProps>(
  (props: ImageProps, forwardedRef) => {
    const {
      src,
      cardType,
      alt = "",
      rootClasses,
      square = false,
      csVariant = "primary",
      intrinsicWidth,
      intrinsicHeight,
      ...forwardedProps
    } = props;
    const fProps = forwardedProps as ImageProps;

    return (
      <Frame
        {...fProps}
        primitiveType="window"
        rootClasses={classnames(
          "ts-image__wrapper",
          src ? undefined : "ts-image__wrapper--noimage",
          ...componentClasses(csVariant, undefined, undefined),
          rootClasses,
          square ? "ts-image--issquare" : "ts-image--is3by4"
        )}
        ref={forwardedRef}
      >
        {src ? (
          <Frame
            primitiveType="window"
            rootClasses={classnames(
              "ts-image__content",
              ...componentClasses(csVariant, undefined, undefined),
              "ts-image--fullwidth"
            )}
          >
            <img src={src} alt={alt} className="ts-image" />
          </Frame>
        ) : (
          <NewIcon
            wrapperClasses={classnames(
              "ts-image__content",
              ...componentClasses(csVariant, undefined, undefined)
            )}
          >
            <FontAwesomeIcon icon={getIcon(cardType)} />
          </NewIcon>
        )}
      </Frame>
    );
  }
);

Image.displayName = "Image";

// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
const getIcon = (type: ImageProps["cardType"] = "community") =>
  ({
    community: faGamepad,
    package: faBan,
  }[type]);
