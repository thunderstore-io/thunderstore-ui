import { type LoaderFunctionArgs } from "react-router";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/healthz") {
    return Response.json({ message: "ok" }, { status: 200 });
  }
}
