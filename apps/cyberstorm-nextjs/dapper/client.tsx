"use client";
import React from "react";

import { DapperProvider } from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";

import { getCookie } from "@/utils/cookie";
import { getPublicApiHost } from "@/config";

export function ClientDapper(props: React.PropsWithChildren) {
  const config = {
    apiHost: getPublicApiHost(),
    sessionId: getCookie("sessionid"),
  };
  const dapperConstructor = () => new DapperTs(config);

  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      {props.children}
    </DapperProvider>
  );
}
