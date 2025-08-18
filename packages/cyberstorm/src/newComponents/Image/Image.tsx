import { faBan, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./Image.css";
import { classnames, componentClasses } from "../../utils/utils";
import { Frame, FrameWindowProps } from "../../primitiveComponents/Frame/Frame";
import { NewIcon } from "../..";
import { memo } from "react";
import { ImageVariants } from "@thunderstore/cyberstorm-theme/src/components";

interface ImageProps extends Omit<FrameWindowProps, "primitiveType"> {
  src: string | null | undefined;
  /** Type of the image defines the icon used as the fallback. */
  cardType: "community" | "communityIcon" | "package";
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
export const Image = memo(function Image(props: ImageProps) {
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
        "image",
        src ? undefined : "image--noimage",
        ...componentClasses("image", csVariant, undefined, undefined),
        rootClasses,
        square ? "image--issquare" : "image--is3by4"
      )}
    >
      {src ? (
        <Frame
          primitiveType="window"
          rootClasses={classnames(
            "image__content",
            ...componentClasses(
              "image__content",
              csVariant,
              undefined,
              undefined
            ),
            "image--fullwidth"
          )}
        >
          <img src={src} alt={alt} className="image__src" />
        </Frame>
      ) : (
        <NewIcon
          rootClasses={classnames(
            "image__content",
            ...componentClasses(
              "image__content",
              csVariant,
              undefined,
              undefined
            ),
            "image__icon"
          )}
          noWrapper
          csMode="inline"
        >
          <FontAwesomeIcon icon={getIcon(cardType)} />
        </NewIcon>
      )}
    </Frame>
  );
});

Image.displayName = "Image";

// There is an issue with Typescript (eslint) and prettier disagreeing if
// the type should have parentheses
// prettier-ignore
const getIcon = (type: ImageProps["cardType"] = "community") =>
  ({
    communityIcon: faGamepad,
    community: faGamepad,
    package: faBan,
  }[type]);
