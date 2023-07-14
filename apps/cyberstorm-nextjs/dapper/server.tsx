import React from "react";

import { Dapper, DapperProvider } from "@thunderstore/dapper/src";
import { API_DOMAIN } from "@/utils/constants";

export function ServerDapper(props: React.PropsWithChildren) {
  const dapperConstructor = () => new Dapper(API_DOMAIN, undefined);
  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      <>{props.children}</>
    </DapperProvider>
  );
}
