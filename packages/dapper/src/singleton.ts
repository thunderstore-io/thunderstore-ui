import { DapperInterface } from "./dapper";

interface GlobalContext {
  Dapper?: DapperContext;
}

function getGlobalContext(): GlobalContext {
  if (typeof window === "undefined") {
    return globalThis as unknown as GlobalContext;
  } else {
    if (globalThis as unknown) {
      return globalThis as unknown as GlobalContext;
    } else {
      return window as unknown as GlobalContext;
    }
  }
}

const globalContext = getGlobalContext();

class DapperContext {
  private dapper?: DapperInterface = undefined;

  public initialize(dapperConstructor: () => DapperInterface) {
    if (this.dapper) return;
    this.dapper = dapperConstructor();
  }

  public getDapper(): DapperInterface {
    if (!this.dapper) {
      throw new Error("Attempted to access dapper before initialization!");
    }
    return this.dapper;
  }
}

export function getDapperContext(): DapperContext {
  if (!globalContext.Dapper) {
    globalContext.Dapper = new DapperContext();
  }
  return globalContext.Dapper;
}
