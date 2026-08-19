import { TabFetchState } from "app/p/components/TabFetchState/TabFetchState";
import { getSessionTools } from "cyberstorm/security/publicEnvVariables";
import { getApiHostForSsr } from "cyberstorm/utils/env";
import { createSeo } from "cyberstorm/utils/meta";
import { ssrLoader } from "cyberstorm/utils/ssrLoader";
import { Suspense } from "react";
import { Await } from "react-router";
import { useLoaderData } from "react-router";

import { SkeletonBox } from "@thunderstore/cyberstorm";
import { DapperTs } from "@thunderstore/dapper-ts";

import type { Route } from "./+types/PackageVersionReadme";
import "./Readme.css";

export const loader = ssrLoader(
  async ({ params }: Route.LoaderArgs) => {
    if (params.namespaceId && params.packageId && params.packageVersion) {
      const dapper = new DapperTs(() => {
        return {
          apiHost: getApiHostForSsr(),
          sessionId: undefined,
        };
      });
      // No SEO here: inherit the canonical title + description from the parent
      // packageListingVersion route instead of templating them (TS-3390).
      return {
        readme: await dapper.getPackageReadme(
          params.namespaceId,
          params.packageId,
          params.packageVersion
        ),
      };
    }
    return {
      status: "error",
      message: "Failed to load readme",
      readme: { html: "", is_edited: false, edited_at: null },
      seo: createSeo({
        descriptors: [{ title: "Readme Not Found | Thunderstore" }],
      }),
    };
  },
  { cache: true }
);

export { forwardLoaderHeaders as headers } from "cyberstorm/utils/ssrLoader";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  if (params.namespaceId && params.packageId && params.packageVersion) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    return {
      readme: dapper.getPackageReadme(
        params.namespaceId,
        params.packageId,
        params.packageVersion
      ),
    };
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "", is_edited: false, edited_at: null },
  };
}

export default function PackageVersionReadme() {
  const { status, message, readme } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "error") {
    return <TabFetchState variant="danger" message={message} />;
  }

  return (
    <Suspense fallback={<SkeletonBox className="package-readme__skeleton" />}>
      <Await
        resolve={readme}
        errorElement={
          <TabFetchState
            variant="danger"
            message="Error occurred while loading description"
          />
        }
      >
        {(resolvedValue) =>
          resolvedValue && resolvedValue.html ? (
            <div className="markdown-wrapper">
              {resolvedValue.is_edited ? (
                <div
                  className="markdown-edited-note"
                  title="This content has been edited on the site and may not match the downloaded package."
                >
                  Edited
                  {resolvedValue.edited_at
                    ? ` · ${new Date(
                        resolvedValue.edited_at
                      ).toLocaleDateString()}`
                    : ""}
                </div>
              ) : null}
              <div
                dangerouslySetInnerHTML={{ __html: resolvedValue.html }}
                className="markdown"
              />
            </div>
          ) : (
            <TabFetchState variant="info" message="No details available" />
          )
        }
      </Await>
    </Suspense>
  );
}
