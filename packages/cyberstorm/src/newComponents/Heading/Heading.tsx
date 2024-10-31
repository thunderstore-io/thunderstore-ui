import "./Heading.css";
import React from "react";
import {
  Frame,
  FrameHeadingProps,
  FrameDisplayProps,
} from "../../primitiveComponents/Frame/Frame";
import { classnames, componentClasses } from "../../utils/utils";
import {
  HeadingVariants,
  HeadingSizes,
  HeadingModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";

interface DefaultProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    Omit<FrameHeadingProps, "primitiveType">,
    Omit<FrameDisplayProps, "primitiveType"> {
  mode?: "heading" | "display";
  csVariant?: HeadingVariants;
  csSize?: HeadingSizes;
  csModifiers?: HeadingModifiers[];
}

export const Heading = React.forwardRef<HTMLHeadingElement, DefaultProps>(
  (props: DefaultProps, forwardedRef) => {
    const {
      children,
      rootClasses,
      csLevel = "1",
      csVariant = "primary",
      csModifiers,
      csSize,
      mode = "heading",
      ...forwardedProps
    } = props;
    const fProps = forwardedProps as DefaultProps;

    return (
      <Frame
        {...fProps}
        primitiveType={mode}
        rootClasses={classnames(
          `ts-${mode}`,
          ...componentClasses(
            csVariant,
            csSize ? csSize : csLevel,
            csModifiers
          ),
          rootClasses
        )}
        csLevel={csLevel}
        ref={forwardedRef}
      >
        {children}
      </Frame>
    );
  }
);

Heading.displayName = "Heading";
