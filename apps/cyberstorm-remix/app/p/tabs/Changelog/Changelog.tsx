import styles from "../../../Markdown.module.css";
import { getDapper } from "cyberstorm/dapper/sessionUtils";
import { ApiError } from "@thunderstore/thunderstore-api";
import { useLoaderData } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const dapper = await getDapper();
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
        // REMIX TODO: Add sentry
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
      const dapper = await getDapper(true);
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
        // REMIX TODO: Add sentry
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
      <div
        dangerouslySetInnerHTML={{ __html: changelog.html }}
        className={styles.root}
      />
    );
  }
  return <div>{message}</div>;
}
