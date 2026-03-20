import { sanitizeReturnUrl } from "cyberstorm/utils/ThunderstoreAuth";
import { createSeo } from "cyberstorm/utils/meta";
import { useSearchParams } from "react-router";

import { NotLoggedIn } from "../commonComponents/NotLoggedIn/NotLoggedIn";

export async function loader() {
  return {
    seo: createSeo({
      descriptors: [
        { title: "Log in | Thunderstore" },
        { name: "description", content: "Log in to your Thunderstore account" },
      ],
    }),
  };
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const rawReturnUrl = searchParams.get("returnUrl");
  const returnUrl = sanitizeReturnUrl(rawReturnUrl);

  return (
    <div className="container container--x container--full">
      <NotLoggedIn
        returnUrl={returnUrl}
        title={returnUrl ? undefined : "Log in to Thunderstore"}
      />
    </div>
  );
}
