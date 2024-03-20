"use client";
import React from "react";

import { DapperProvider } from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";

import { getCookie } from "@/utils/cookie";

export function ClientDapper(props: React.PropsWithChildren) {
  const config = {
    apiHost: process.env.NEXT_PUBLIC_API_DOMAIN || "https://thunderstore.io",
    sessionId: getCookie("sessionid"),
    csrfToken: getCookie("csrftoken"),
  };
  const dapperConstructor = () => new DapperTs(config);

  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      {props.children}
    </DapperProvider>
  );
}
