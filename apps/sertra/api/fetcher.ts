import { Fetcher } from "swr";

// TODO: Type better
export const fetcher: Fetcher<any, any> = (
  input: RequestInfo,
  init?: RequestInit
) => fetch(input, init).then((res) => res.json());
