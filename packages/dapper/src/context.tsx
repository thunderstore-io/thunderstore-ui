import React from "react";

import { DapperInterface } from "./dapper";

type ContextProps = { dapper: DapperInterface; children?: React.ReactNode };
const DapperContext = React.createContext<DapperInterface | null>(null);

export function DapperProvider(props: ContextProps) {
  const { dapper, children } = props;
  return (
    <DapperContext.Provider value={dapper}>{children}</DapperContext.Provider>
  );
}

export const useDapper = (): DapperInterface => {
  const contextState = React.useContext(DapperContext);

  if (contextState === null) {
    throw new Error("useDapper must be used within a DapperProvider tag");
  }

  return contextState;
};
