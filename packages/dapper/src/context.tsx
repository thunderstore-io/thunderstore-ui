import React from "react";

import { DapperInterface } from "./dapper";

type ContextProps = { dapper: DapperInterface };
const DapperContext = React.createContext<DapperInterface | null>(null);

export const DapperProvider: React.FC<ContextProps> = (props) => {
  return (
    <DapperContext.Provider value={props.dapper}>
      {props.children}
    </DapperContext.Provider>
  );
};

export const useDapper = (): DapperInterface => {
  const contextState = React.useContext(DapperContext);

  if (contextState === null) {
    throw new Error("useDapper must be used within a DapperProvider tag");
  }

  return contextState;
};
