// Disable SSR for now, until we've split the "Cyberstorm layouts"
// into actual NextJS layouts
// Then we can have SSR on some parts of the page
// There seems to be no way of disabling SSR on certain components,
// without using nextjs in Cyberstorm library

import dynamic from "next/dynamic";

const DynamicCommunityListLayout = dynamic(
  () =>
    import(
      "@thunderstore/cyberstorm/src/components/Layout/CommunityListLayout/CommunityListLayout"
    ),
  {
    ssr: false,
  }
);

export default function Page() {
  return <DynamicCommunityListLayout />;
}
