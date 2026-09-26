import { faEdit } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Suspense } from "react";
import { Await } from "react-router";

import { NewButton, NewIcon } from "@thunderstore/cyberstorm";

import { type getUserPermissions } from "../../listingUtils";

export function EditMarkdownButton(props: {
  permissions: ReturnType<typeof getUserPermissions> | undefined;
  community: string;
  namespace: string;
  package: string;
  version: string;
  queryParams?: string;
}) {
  return (
    <Suspense fallback={null}>
      <Await resolve={props.permissions} errorElement={<></>}>
        {(resolvedPermissions) =>
          resolvedPermissions?.permissions.can_manage_wiki ? (
            <NewButton
              csSize="small"
              csVariant="secondary"
              csModifiers={["ghost"]}
              primitiveType="cyberstormLink"
              linkId="PackageVersionReadmeEdit"
              community={props.community}
              namespace={props.namespace}
              package={props.package}
              version={props.version}
              queryParams={props.queryParams}
            >
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faEdit} />
              </NewIcon>
              Edit
            </NewButton>
          ) : null
        }
      </Await>
    </Suspense>
  );
}
