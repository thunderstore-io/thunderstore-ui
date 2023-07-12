"use client";

import { SetDapperSingleton } from "@thunderstore/dapper/src/singleton";
import { Dapper } from "@thunderstore/dapper/src/dapper";
import { API_DOMAIN } from "@/utils/constants";
import { PropsWithChildren } from "react";

export const DapperSetup = (props: PropsWithChildren) => {
  // TODO: Find a way to solve the session ID disparity betwene client & server
  // import { useSession } from "@/utils/SessionContext";
  // const { sessionId } = useSession();
  const sessionId = undefined;
  const dapper = new Dapper(API_DOMAIN, sessionId);
  SetDapperSingleton(dapper);
  console.log("Dapper singleton configured from getCommunities()!");
  return <>{props.children}</>;
};
