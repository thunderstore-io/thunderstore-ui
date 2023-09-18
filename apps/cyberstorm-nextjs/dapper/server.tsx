import React from "react";

import { DapperProvider } from "@thunderstore/dapper";
import { DapperTs } from "@thunderstore/dapper-ts";

import { API_DOMAIN } from "@/utils/constants";

export function ServerDapper(props: React.PropsWithChildren) {
  const dapperConstructor = () => new DapperTs({ apiHost: API_DOMAIN });

  return (
    <DapperProvider dapperConstructor={dapperConstructor}>
      {props.children}
    </DapperProvider>
  );
}
