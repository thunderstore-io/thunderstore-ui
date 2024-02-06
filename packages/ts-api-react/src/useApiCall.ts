import { RequestConfig } from "@thunderstore/thunderstore-api";
import { useSession } from "./SessionContext";

export type ApiEndpoint<Data, Result> = (
  config: RequestConfig,
  data: Data,
  metaData: any
) => Promise<Result>;
export function useApiCall<Data, Result>(
  endpoint: ApiEndpoint<Data, Result>
): (data: Data, metaData: any) => Promise<Result> {
  const session = useSession();
  const apiConfig = {
    apiHost: session.domain,
    sessionId: session.sessionId,
  };
  return (data: Data, metaData: any) => endpoint(apiConfig, data, metaData);
}
