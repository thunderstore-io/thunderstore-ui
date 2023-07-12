/*
Singleton variant of dapper initialization, as React context is not yet
supported in NextJS 13.

Usage:
- Call `SetDapperSingleton` in the initialization phase of the app
- Use the `useDapper` React hook as usual afterwards.
 */
import { DapperInterface } from "./dapper";

let instance: DapperInterface | null = null;

export function SetDapperSingleton(dapper: DapperInterface) {
  instance = dapper;
}

export function GetDapperSingleton(): DapperInterface {
  if (instance == null) {
    throw new Error("Attempted to access dapper before initialization!");
  }
  return instance;
}
