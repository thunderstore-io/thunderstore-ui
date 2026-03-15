import { ssrLoader } from "cyberstorm/utils/ssrLoader";

import type { Route } from "./+types/healthz";

export const loader = ssrLoader(async ({ request }: Route.LoaderArgs) => {
  const url = new URL(request.url);
  if (url.pathname === "/healthz") {
    return Response.json({ message: "ok" }, { status: 200 });
  }
});
