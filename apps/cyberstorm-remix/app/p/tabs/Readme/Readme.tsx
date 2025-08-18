import { LoaderFunctionArgs } from "react-router";
import { ApiError } from "@thunderstore/thunderstore-api";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import { getSessionTools } from "~/middlewares";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const dapper = new DapperTs(() => {
        return {
          apiHost: import.meta.env.VITE_API_URL,
          sessionId: undefined,
        };
      });
      return {
        status: "ok",
        message: "",
        readme: await dapper.getPackageReadme(
          params.namespaceId,
          params.packageId
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          status: "error",
          message: "Failed to load readme",
          readme: { html: "" },
        };
      } else {
        throw error;
      }
    }
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
  };
}

export async function clientLoader({ context, params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const tools = getSessionTools(context);
      const dapper = new DapperTs(() => {
        return {
          apiHost: tools?.getConfig().apiHost,
          sessionId: tools?.getConfig().sessionId,
        };
      });
      return {
        status: "ok",
        message: "",
        readme: await dapper.getPackageReadme(
          params.namespaceId,
          params.packageId
        ),
      };
    } catch (error) {
      if (error instanceof ApiError) {
        return {
          status: "error",
          message: "Failed to load readme",
          readme: { html: "" },
        };
      } else {
        throw error;
      }
    }
  }
  return {
    status: "error",
    message: "Failed to load readme",
    readme: { html: "" },
  };
}

export default function Readme() {
  const { status, message, readme } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  if (status === "ok") {
    return (
      <div className="markdown-wrapper">
        <div
          dangerouslySetInnerHTML={{ __html: readme.html }}
          className="markdown"
        />
      </div>
    );
  }
  return <div>{message}</div>;
}
