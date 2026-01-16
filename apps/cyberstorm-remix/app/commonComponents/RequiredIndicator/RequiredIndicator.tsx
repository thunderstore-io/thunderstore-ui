import { memo } from "react";

export interface RequiredIndicatorProps {
  title?: string;
  className?: string;
}

export const RequiredIndicator = memo(function RequiredIndicator(
  props: RequiredIndicatorProps
) {
  const { title = "Required", className } = props;

  return (
    <span aria-hidden="true" title={title} className={className}>
      *
    </span>
  );
});

RequiredIndicator.displayName = "RequiredIndicator";
