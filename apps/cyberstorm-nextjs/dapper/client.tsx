"use client";
import React from "react";

import { DapperProvider } from "@thunderstore/dapper/src";
import { DummyDapper } from "@thunderstore/dapper/src/implementations/dummy/DummyDapper";

export function ClientDapper(props: React.PropsWithChildren) {
  // import { API_DOMAIN } from "@/utils/constants";
  // const dapperConstructor = () => new Dapper(API_DOMAIN, undefined);
  const dapperConstructor = () => new DummyDapper();
  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      <>{props.children}</>
    </DapperProvider>
  );
}
