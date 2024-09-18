import styles from "../../sharedComponentStyles/TagStyles/Tag.module.css";
import React from "react";
import { Frame, FrameWindowProps } from "../../primitiveComponents/Frame/Frame";
import { classnames } from "../../utils/utils";

interface TagProps extends Omit<FrameWindowProps, "primitiveType"> {
  dark?: boolean;
  hoverable?: boolean;
}

export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  (props: TagProps, forwardedRef) => {
    const {
      children,
      rootClasses,
      csSize = "m",
      csColor = "surface",
      // Consume this prop since tag doesn't have other variants
      csVariant,
      dark,
      hoverable,
      ...forwardedProps
    } = props;
    const fProps = forwardedProps as FrameWindowProps;
    return (
      <Frame
        {...fProps}
        primitiveType={"window"}
        rootClasses={classnames(
          styles.tag,
          hoverable ? styles.hoverable : null,
          dark ? styles.dark : null,
          rootClasses
        )}
        csSize={csSize}
        csColor={csColor}
        // Tag doesn't have other variants, just re-colors
        csVariant={"default"}
        csTextStyles={
          csSize === "s"
            ? ["fontSizeXXS", "fontWeightBold"]
            : ["fontSizeXS", "fontWeightBold"]
        }
        ref={forwardedRef}
      >
        {children}
      </Frame>
    );
  }
);

Tag.displayName = "Tag";
