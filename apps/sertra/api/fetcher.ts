import { Fetcher, Key } from "swr";

export const fetcher: Fetcher<unknown, Key> = (
  input: RequestInfo,
  init?: RequestInit
) => fetch(input, init).then((res) => res.json());
