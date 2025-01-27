import { classnames } from "../../utils/utils";
import "./SkeletonBox.css";

/**
 * Component for centralizing the styles of skeleton placeholders
 * @param className String to be added in the div elements className attribute
 * @returns A div element with skeleton component styling (flex and no width or height)
 */
export function SkeletonBox({ className }: { className?: string }) {
  return <div className={classnames("ts-skeleton", className)} />;
}

SkeletonBox.displayName = "SkeletonBox";
