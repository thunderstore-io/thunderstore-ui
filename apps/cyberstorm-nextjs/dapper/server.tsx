import React from "react";

import { DapperProvider } from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getPublicApiUrl } from "@/config";

export function ServerDapper(props: React.PropsWithChildren) {
  const dapperConstructor = () =>
    new DapperTs({
      apiHost: getPublicApiUrl(),
    });

  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      {props.children}
    </DapperProvider>
  );
}
