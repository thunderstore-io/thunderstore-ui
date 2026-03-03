import type { Route } from "./+types/healthz";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/healthz") {
    return Response.json({ message: "ok" }, { status: 200 });
  }
}
