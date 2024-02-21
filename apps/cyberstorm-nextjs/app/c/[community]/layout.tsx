import { ReactNode, Suspense } from "react";

export default function CommunityLayout({
  community,
  children,
}: {
  community: ReactNode;
  children: ReactNode;
}) {
  if (children) {
    return (
      <Suspense fallback={<p>TODO: CHILDREN SKELETON</p>}>{children}</Suspense>
    );
  }
  return (
    <Suspense fallback={<p>TODO: COMMUNITY SLOT SKELETON</p>}>
      {community}
    </Suspense>
  );
}
