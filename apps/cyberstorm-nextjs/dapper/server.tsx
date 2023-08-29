import React from "react";

import { DapperProvider, DummyDapper } from "@thunderstore/dapper";
// import { API_DOMAIN } from "@/utils/constants";

export function ServerDapper(props: React.PropsWithChildren) {
  // const dapperConstructor = () => new Dapper(API_DOMAIN, undefined);
  const dapperConstructor = () => new DummyDapper();
  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      <>{props.children}</>
    </DapperProvider>
  );
}
