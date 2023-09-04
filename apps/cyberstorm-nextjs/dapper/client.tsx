"use client";
import React from "react";

import { DapperProvider } from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";

export function ClientDapper(props: React.PropsWithChildren) {
  // import { API_DOMAIN } from "@/utils/constants";
  // const dapperConstructor = () => new Dapper(API_DOMAIN, undefined);
  const dapperConstructor = () => new DapperTs();
  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      {props.children}
    </DapperProvider>
  );
}
