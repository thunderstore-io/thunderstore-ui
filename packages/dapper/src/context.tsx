import { PropsWithChildren } from "react";

import { DapperFake } from "../../dapper-fake/src/index";
import { DapperInterface } from "./dapper";
import { getDapperContext } from "./singleton";

type DapperProviderProps = PropsWithChildren<{
  dapperConstructor: () => DapperInterface;
}>;

export function DapperProvider(props: DapperProviderProps) {
  /**
   * Does NOT support changing the dapper instance after initialization. The
   * dapper instance will be created only once regardless of prop changes and
   * bound to the global scope. On NextJS the instance may be shared between all
   * requests handled by the server depending on the server configuration.
   *
   * TREAT AS A GLOBAL SINGLETON THAT'S SHARED ACROSS THE ENTIRE PROCESS.
   */
  const dapperContext = getDapperContext();
  dapperContext.initialize(props.dapperConstructor);
  return <>{props.children}</>;
}

export const useDapper = (): DapperInterface => {
  return new DapperFake();
  const dapperContext = getDapperContext();
  return dapperContext.getDapper();
};
