import { faBan, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./Image.module.css";
import { classnames } from "../../utils/utils";
import { Frame, FrameWindowProps } from "../../primitiveComponents/Frame/Frame";
import { Icon } from "../..";
import React from "react";

interface ImageProps extends Omit<FrameWindowProps, "primitiveType"> {
  src: string | null;
  /** Type of the image defines the icon used as the fallback. */
  cardType: "community" | "package";
  /** Alt text for the image. Leave empty for decorative images. */
  alt?: string;
  /** Force 1:1 aspect ratio */
  square?: boolean;
}

/**
 * Show the image, or use predefined icon as the fallback.
 */
export const Image = React.forwardRef<HTMLDivElement, ImageProps>(
  (props: ImageProps, forwardedRef) => {
    // const { src, type, alt = "", rootClasses, square = false } = props;
    const {
      src,
      cardType,
      alt = "",
      rootClasses,
      square = false,
      csColor = "surface",
      csVariant = "default",
      ...forwardedProps
    } = props;
    const fProps = forwardedProps as ImageProps;
    // const forwardedClasses = classnames(
    //   styles.imageWrapper,
    //   rootClasses,
    //   square ? styles.isSquare : styles.is3By4
    // );

    return (
      <Frame
        {...fProps}
        primitiveType="window"
        rootClasses={classnames(
          styles.imageWrapper,
          rootClasses,
          square ? styles.isSquare : styles.is3By4
        )}
        csColor={csColor}
        csVariant={csVariant}
        ref={forwardedRef}
      >
        {src ? (
          <Frame
            primitiveType="window"
            rootClasses={classnames(styles.imageContent, styles.fullWidth)}
          >
            <img src={src} alt={alt} className={styles.image} />
          </Frame>
        ) : (
          <Icon wrapperClasses={styles.imageContent}>
            <FontAwesomeIcon icon={getIcon(cardType)} />
          </Icon>
        )}
      </Frame>
    );

    // if (src) {
    //   return (
    //     <div className={rootClasses}>
    //       <div className={classnames(styles.imageContent, styles.fullWidth)}>
    //         <img src={src} alt={alt} className={styles.image} />
    //       </div>
    //     </div>
    //   );
    // }

    // return (
    //   <div className={rootClasses}>
    //     <Icon wrapperClasses={styles.imageContent}>
    //       <FontAwesomeIcon icon={getIcon(type)} />
    //     </Icon>
    //   </div>
    // );
  }
);

Image.displayName = "Image";

const getIcon = (type: ImageProps["cardType"] = "community") =>
  ({
    community: faGamepad,
    package: faBan,
  }[type]);
