import { faBan, faGamepad } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import styles from "./ImageWithFallback.module.css";
import { Icon } from "../Icon/Icon";
import { classnames } from "../../utils/utils";

interface Props {
  src: string | null;
  /** Type of the image defines the icon used as the fallback. */
  type: "community" | "package";
  /** Alt text for the image. Leave empty for decorative images. */
  alt?: string;
  /**
   * Class name to be passed to the root element of ImageWithFallback.
   *
   * This can be used to implement hover styles to the image when the
   * parent is hovered. Since there's no parent selector, the styling
   * needs to be done in the CSS module of the parent component.
   */
  rootClass?: string;
  /** Force 1:1 aspect ratio */
  square?: boolean;
}

/**
 * Show the image, or use predefined icon as the fallback.
 */
export const ImageWithFallback = (props: Props) => {
  const { src, type, alt = "", rootClass, square = false } = props;
  const rootClasses = classnames(
    styles.imageWrapper,
    rootClass,
    square ? styles.isSquare : styles.is3By4
  );

  if (src) {
    return (
      <div className={rootClasses}>
        <div className={classnames(styles.imageContent, styles.fullWidth)}>
          <img src={src} alt={alt} className={styles.image} />
        </div>
      </div>
    );
  }

  return (
    <div className={rootClasses}>
      <Icon wrapperClasses={styles.imageContent}>
        <FontAwesomeIcon icon={getIcon(type)} />
      </Icon>
    </div>
  );
};

ImageWithFallback.displayName = "ImageWithFallback";

const getIcon = (type: Props["type"] = "community") =>
  ({
    community: faGamepad,
    package: faBan,
  }[type]);
