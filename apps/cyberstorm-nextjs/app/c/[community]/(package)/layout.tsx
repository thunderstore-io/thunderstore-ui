import { ReactNode, Suspense } from "react";

export default function CommunityLayout({
  tspackage,
}: {
  tspackage: ReactNode;
}) {
  return (
    <Suspense fallback={<p>TODO: CHILDREN SKELETON</p>}>{tspackage}</Suspense>
  );
}
