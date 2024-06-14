import { RequestConfig } from "@thunderstore/thunderstore-api";
import { useSession } from "./SessionContext";

export type ApiEndpoint<Data, Meta, Result> = (
  config: RequestConfig,
  data: Data,
  meta: Meta
) => Promise<Result>;
export function useApiCall<Data, Meta, Result>(
  endpoint: ApiEndpoint<Data, Meta, Result>
): (data: Data, meta: Meta) => Promise<Result> {
  const session = useSession();
  const apiConfig = {
    apiHost: session.domain,
    sessionId: session.sessionId,
    csrfToken: session.csrfToken,
  };
  return (data: Data, meta: Meta) => endpoint(apiConfig, data, meta);
}
