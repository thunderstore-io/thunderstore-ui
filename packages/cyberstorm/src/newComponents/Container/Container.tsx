import React from "react";

import { type PrimitiveComponentDefaultProps } from "../../primitiveComponents/utils/utils";
import { classnames } from "../../utils/utils";
import "./Container.css";

export interface ContainerProps extends PrimitiveComponentDefaultProps {
  size?: "narrow" | "wide";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  (props: ContainerProps, forwardedRef) => {
    const { children, rootClasses, size = "narrow", ...forwardedProps } = props;

    return (
      <div
        {...forwardedProps}
        className={classnames("container", rootClasses)}
        ref={forwardedRef}
        data-size={size}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";

export default Container;
