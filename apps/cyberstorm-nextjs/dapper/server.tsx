import React from "react";

import { DapperProvider } from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";

export function ServerDapper(props: React.PropsWithChildren) {
  const dapperConstructor = () =>
    new DapperTs({
      apiHost: process.env.NEXT_PUBLIC_API_DOMAIN || "https://thunderstore.io",
    });

  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      {props.children}
    </DapperProvider>
  );
}
