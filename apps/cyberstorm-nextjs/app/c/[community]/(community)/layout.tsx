import { ReactNode, Suspense } from "react";

export default function CommunityLayout({
  community,
}: {
  community: ReactNode;
}) {
  return (
    <Suspense fallback={<p>TODO: COMMUNITY SLOT SKELETON</p>}>
      {community}
    </Suspense>
  );
}
