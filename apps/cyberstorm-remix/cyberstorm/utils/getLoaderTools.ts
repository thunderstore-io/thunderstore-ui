import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";

export function getLoaderTools() {
  let dapper: DapperTs;
  let sessionTools: ReturnType<typeof getSessionTools> | undefined;
  if (import.meta.env.SSR) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
  } else {
    sessionTools = getSessionTools();
    dapper = new DapperTs(() => {
      return {
        apiHost: sessionTools?.getConfig().apiHost,
        sessionId: sessionTools?.getConfig().sessionId,
      };
    });
  }
  return { dapper, sessionTools };
}
