import { LoaderFunctionArgs, json } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (url.pathname === "/healthz") {
    return json({ message: "ok" }, 200);
  }
}
