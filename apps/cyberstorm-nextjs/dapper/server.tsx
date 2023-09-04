import React from "react";

import { DapperProvider } from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";

export function ServerDapper(props: React.PropsWithChildren) {
  // const dapperConstructor = () => new Dapper(API_DOMAIN, undefined);
  const dapperConstructor = () => new DapperTs();
  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      {props.children}
    </DapperProvider>
  );
}
