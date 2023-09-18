"use client";
import React from "react";

import { DapperProvider } from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";

import { API_DOMAIN } from "@/utils/constants";
import { getCookie } from "@/utils/cookie";

export function ClientDapper(props: React.PropsWithChildren) {
  const config = { apiHost: API_DOMAIN, sessionId: getCookie("sessionid") };
  const dapperConstructor = () => new DapperTs(config);

  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      {props.children}
    </DapperProvider>
  );
}
