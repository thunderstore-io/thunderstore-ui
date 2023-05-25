"use client";

import { Hydrate as RQHydrate, HydrateProps } from "react-query";

function Hydrate(props: HydrateProps) {
  return <RQHydrate {...props} />;
}

export default Hydrate;
