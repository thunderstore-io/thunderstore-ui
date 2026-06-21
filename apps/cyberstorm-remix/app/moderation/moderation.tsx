import { faClipboardCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { redirectToLogin } from "cyberstorm/utils/ThunderstoreAuth";
import { getCanonicalUrl } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { useLoaderData } from "react-router";
import { Page } from "~/commonComponents/Page/Page";
import { PageHeader } from "~/commonComponents/PageHeader/PageHeader";

import { NewAlert, NewIcon, NewLink } from "@thunderstore/cyberstorm";
import {
  fetchModerationReviewListings,
  isApiError,
} from "@thunderstore/thunderstore-api";

import type { Route } from "./+types/moderation";
import "./moderation.css";

export { RouteErrorBoundary as ErrorBoundary } from "app/commonComponents/ErrorBoundary";

// Moderation tools surfaced on the hub. Each is its own full-page child route
// under /moderation (not an <Outlet>); add new tools/entities here.
const MODERATION_TOOLS = [
  {
    linkId: "ModerationReviewPackages" as const,
    icon: faClipboardCheck,
    title: "Package review",
    description:
      "Review packages awaiting moderation across the communities you moderate.",
  },
];

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const tools = getSessionTools();
  const currentUser = await tools?.getSessionCurrentUser(true);
  const url = new URL(request.url);

  if (!currentUser?.username) {
    return redirectToLogin(url.pathname + url.search + url.hash);
  }

  const config = () => ({
    apiHost: tools.getConfig().apiHost,
    sessionId: tools.getConfig().sessionId,
  });

  const seo = createSeo({
    descriptors: [
      { title: "Moderation | Thunderstore" },
      { name: "robots", content: "noindex" },
      { property: "og:url", content: getCanonicalUrl(request) },
    ],
  });

  // The backend is the source of truth for moderation access: probe the review
  // resource and let a 403 decide whether to show the tools. The client-side
  // is_moderator flag only drives nav-link visibility — it never gates the
  // actual resource, so a stale/forged flag can't reveal moderation data.
  try {
    await fetchModerationReviewListings({ config, page: 1 });
    return { canModerate: true, seo };
  } catch (error) {
    if (isApiError(error) && error.response.status === 403) {
      return { canModerate: false, seo };
    }
    throw error;
  }
}

clientLoader.hydrate = true;

export default function Moderation() {
  const { canModerate } = useLoaderData<typeof clientLoader>();

  return (
    <Page>
      <PageHeader headingLevel="1" headingSize="2">
        Moderation
      </PageHeader>

      {!canModerate ? (
        <NewAlert csVariant="danger">
          You don&apos;t have moderation permissions in any community.
        </NewAlert>
      ) : (
        <div className="moderation-hub">
          {MODERATION_TOOLS.map((tool) => (
            <NewLink
              key={tool.linkId}
              primitiveType="cyberstormLink"
              linkId={tool.linkId}
              rootClasses="moderation-hub__card"
            >
              <NewIcon
                csMode="inline"
                noWrapper
                rootClasses="moderation-hub__card-icon"
              >
                <FontAwesomeIcon icon={tool.icon} />
              </NewIcon>
              <span className="moderation-hub__card-title">{tool.title}</span>
              <span className="moderation-hub__card-description">
                {tool.description}
              </span>
            </NewLink>
          ))}
        </div>
      )}
    </Page>
  );
}
