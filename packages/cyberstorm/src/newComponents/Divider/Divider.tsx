import { memo } from "react";

import { type PrimitiveComponentDefaultProps } from "../../primitiveComponents/utils/utils";
import { classnames } from "../../utils/utils";
import "./Divider.css";

export const Divider = memo(function Divider(
  props: PrimitiveComponentDefaultProps
) {
  const { rootClasses } = props;

  return (
    <div className={classnames("divider", rootClasses)} role="presentation" />
  );
});

Divider.displayName = "Divider";
