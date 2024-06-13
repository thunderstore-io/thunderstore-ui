import { LoaderFunctionArgs } from "@remix-run/node";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import styles from "../../../Markdown.module.css";
import { ApiError } from "@thunderstore/thunderstore-api";
import { useLoaderData } from "@remix-run/react";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const dapper = await getDapper();
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
        // REMIX TODO: Add sentry
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

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const dapper = await getDapper(true);
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
        // REMIX TODO: Add sentry
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
      <div
        dangerouslySetInnerHTML={{ __html: readme.html }}
        className={styles.root}
      />
    );
  }
  return <div>{message}</div>;
}
