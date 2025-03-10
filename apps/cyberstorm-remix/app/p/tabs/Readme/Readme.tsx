import { LoaderFunctionArgs } from "@remix-run/node";
import { ApiError } from "@thunderstore/thunderstore-api";
import { useLoaderData } from "@remix-run/react";
import { DapperTs } from "@thunderstore/dapper-ts";
import { ReactNode, useEffect, useState } from "react";
import "./CodeCopy.css";
import React from "react";

export async function loader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const dapper = new DapperTs(() => {
        return {
          apiHost: process.env.PUBLIC_API_URL,
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

export async function clientLoader({ params }: LoaderFunctionArgs) {
  if (params.namespaceId && params.packageId) {
    try {
      const dapper = window.Dapper;
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

const copySVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:currentcolor;height:16px;width:16px;"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M208 0L332.1 0c12.7 0 24.9 5.1 33.9 14.1l67.9 67.9c9 9 14.1 21.2 14.1 33.9L448 336c0 26.5-21.5 48-48 48l-192 0c-26.5 0-48-21.5-48-48l0-288c0-26.5 21.5-48 48-48zM48 128l80 0 0 64-64 0 0 256 192 0 0-32 64 0 0 48c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 176c0-26.5 21.5-48 48-48z"/></svg>`;
const checkmarkSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="fill:currentcolor;height:16px;width:16px;"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>`;

export default function Readme() {
  const { status, message, readme } = useLoaderData<
    typeof loader | typeof clientLoader
  >();

  const [content, setContent] = useState<ReactNode>();

  useEffect(() => {
    const contentDiv = document.createElement("div");
    contentDiv.innerHTML = readme.html;
    contentDiv.className = "markdown";
    const preElements = contentDiv.querySelectorAll("pre");
    preElements.forEach((preElement) => {
      const cpButton = document.createElement("button");
      cpButton.className = "code-copy";
      cpButton.innerHTML = copySVG;
      preElement.appendChild(cpButton);
    });

    setContent(
      React.createElement("div", {
        className: "markdown",
        dangerouslySetInnerHTML: { __html: contentDiv.innerHTML },
      })
    );
  }, [readme]);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof navigator?.clipboard !== "undefined"
    ) {
      const preElements = document
        .querySelector(".markdown")
        ?.querySelectorAll("pre");
      preElements?.forEach((preElement) => {
        const cpButton = preElement.querySelector("button");
        if (cpButton && cpButton.className === "code-copy") {
          cpButton.onclick = async () => {
            try {
              navigator.clipboard.writeText(
                preElement.querySelector("code")?.innerText ??
                  preElement.innerText
              );
              cpButton.value = "copied";
              cpButton.innerHTML = checkmarkSVG;
              setTimeout(() => {
                cpButton.value = "";
                cpButton.innerHTML = copySVG;
              }, 2000);
            } catch (error) {
              console.warn("Copy failed", error);
            }
          };
          cpButton.onblur = async () => {};
          cpButton.onfocus = async () => {};
        }
      });
    }
  }, [content]);

  if (status === "ok") {
    if (content) {
      return content;
    } else {
      return (
        <div
          dangerouslySetInnerHTML={{ __html: readme.html }}
          className="markdown"
        />
      );
    }
  }
  return <div>{message}</div>;
}
