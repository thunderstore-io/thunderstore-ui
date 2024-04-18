import React from "react";

import { DapperProvider } from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getPublicApiDomain } from "@/config";

export function ServerDapper(props: React.PropsWithChildren) {
  const dapperConstructor = () =>
    new DapperTs({
      apiHost: getPublicApiDomain(),
    });

  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      {props.children}
    </DapperProvider>
  );
}
