import { type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";

import { type ImageVariants } from "@thunderstore/cyberstorm-theme";

import {
  Frame,
  type FrameWindowProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import { Icon as NewIcon } from "../Icon/Icon";
import "./Image.css";

export interface ImageProps extends Omit<FrameWindowProps, "primitiveType"> {
  src: string | null | undefined;
  /** Icon shown when `src` is missing. Omit to render nothing. */
  fallbackIcon?: IconDefinition;
  /** Alt text for the image. Leave empty for decorative images. */
  alt?: string;
  /** Force 1:1 aspect ratio */
  square?: boolean;
  loading?: "eager" | "lazy";
  csVariant?: ImageVariants;
  intrinsicWidth?: number;
  intrinsicHeight?: number;
}

/**
 * Show the image, or use predefined icon as the fallback.
 */
export const Image = memo(function Image(props: ImageProps) {
  const {
    src,
    fallbackIcon,
    alt = "",
    rootClasses,
    square = false,
    csVariant = "primary",
    intrinsicWidth,
    intrinsicHeight,
    loading = "lazy",
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
          <img
            src={src}
            loading={loading}
            alt={alt}
            className="image__src"
            width={intrinsicWidth}
            height={intrinsicHeight}
          />
        </Frame>
      ) : fallbackIcon ? (
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
          <FontAwesomeIcon icon={fallbackIcon} />
        </NewIcon>
      ) : null}
    </Frame>
  );
});

Image.displayName = "Image";
