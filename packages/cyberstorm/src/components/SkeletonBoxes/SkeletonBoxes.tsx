import { range } from "../../utils/utils";
import { SkeletonBox } from "../SkeletonBox/SkeletonBox";

/**
 * Helper function for returning multiple SkeletonBox components
 * @param className String that forwarded to all the SkeletonBox components className param
 * @param count Amount of SkeletonBoxes to be returned
 * @returns A collection of SkeletonBox components
 */
export function SkeletonBoxes({
  className,
  count,
}: {
  className?: string;
  count: number;
}) {
  return (
    <>
      {range(1, count).map((x) => (
        <SkeletonBox key={x} className={className} />
      ))}
    </>
  );
}

SkeletonBoxes.displayName = "SkeletonBoxes";
