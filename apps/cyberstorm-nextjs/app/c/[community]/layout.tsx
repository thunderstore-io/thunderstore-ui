import { ReactNode, Suspense } from "react";

export default function CommunityLayout({
  community,
}: {
  community: ReactNode;
}) {
  return <Suspense fallback={<p>TODO: SKELETON</p>}>{community}</Suspense>;
}
