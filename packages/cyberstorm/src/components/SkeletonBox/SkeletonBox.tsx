import { classnames } from "../../utils/utils";
import styles from "./SkeletonBox.module.css";

/**
 * Cyberstorm SkeletonBox component
 */
export function SkeletonBox({ className }: { className?: string }) {
  return <div className={classnames(styles.root, className)} />;
}

SkeletonBox.displayName = "SkeletonBox";
