import * as Sentry from "@sentry/react-router";
import { useState } from "react";

import type { Route } from "./+types/sentry";

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  if (url.searchParams.get("serverError") === "1") {
    throw new Error("Sentry Test: test server-side loader error");
  }
  return null;
}

export default function SentryTestRoute() {
  const [clientErrorThrown, setClientErrorThrown] = useState(false);

  if (clientErrorThrown) {
    throw new Error("Sentry Test: test client-side render error");
  }

  return (
    <div>
      <h1>Sentry Test</h1>
      <p>Use these actions to verify Sentry is receiving events.</p>
      <ul>
        <li>
          <a href="?serverError=1">Throw a server-side loader error</a>
        </li>
        <li>
          <button
            onClick={() => {
              Sentry.captureException(
                new Error("Sentry Test: test manual captureException")
              );
              alert("captureException called — check Sentry.");
            }}
          >
            Send manual captureException
          </button>
        </li>
        <li>
          <button onClick={() => setClientErrorThrown(true)}>
            Throw a client-side render error
          </button>
        </li>
      </ul>
    </div>
  );
}
