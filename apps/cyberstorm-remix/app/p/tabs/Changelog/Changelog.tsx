import { ApiError } from "@thunderstore/thunderstore-api";
import { useLoaderData } from "react-router";
import { LoaderFunctionArgs } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
      const dapper = new DapperTs(() => {
        return {
          apiHost: publicEnvVariables.VITE_API_URL,
          sessionId: undefined,
        };
      });
      return {
        status: "ok",
        message: "",
        changelog: await dapper.getPackageChangelog(
          params.namespaceId,
          params.packageId
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          status: "error",
          message: "Failed to load changelog",
          changelog: { html: "" },
        };
      } else {
        throw error;
      }
    }
  }
  return {
    status: "error",
    message: "Failed to load changelog",
    changelog: { html: "" },
  };
}

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const tools = getSessionTools();
      const dapper = new DapperTs(() => {
        return {
          apiHost: tools?.getConfig().apiHost,
          sessionId: tools?.getConfig().sessionId,
        };
      });
      return {
        status: "ok",
        message: "",
        changelog: await dapper.getPackageChangelog(
          params.namespaceId,
          params.packageId
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          status: "error",
          message: "Failed to load changelog",
          changelog: { html: "" },
        };
      } else {
        throw error;
      }
    }
  }
  return {
    status: "error",
    message: "Failed to load changelog",
    changelog: { html: "" },
  };
}

export default function Changelog() {
  const { status, message, changelog } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "ok") {
    return (
      <div className="markdown-wrapper">
        <div
          dangerouslySetInnerHTML={{ __html: changelog.html }}
          className="markdown"
        />
      </div>
    );
  }
  return <div>{message}</div>;
}
