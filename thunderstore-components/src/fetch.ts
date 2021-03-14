import { ThunderstoreProviderProps } from "./components/ThunderstoreProvider";

export const apiFetch = async (
  context: ThunderstoreProviderProps,
  endpoint: string,
  fetchOptions: RequestInit = {}
): Promise<Response> => {
  const apiToken = localStorage.getItem("apiToken");
  if (apiToken !== null) {
    const headers = new Headers(fetchOptions.headers);
    headers.append("Authorization", `Bearer ${apiToken}`);
    fetchOptions.headers = headers;
  }
  return await fetch(context.apiUrl + endpoint.substring(1), fetchOptions);
};
