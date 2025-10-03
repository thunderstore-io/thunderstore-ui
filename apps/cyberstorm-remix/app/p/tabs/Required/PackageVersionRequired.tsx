import "./Required.css";
import { Heading, SkeletonBox } from "@thunderstore/cyberstorm";
import {
  Await,
  useNavigationType,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";
import { useLoaderData } from "react-router";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useDebounce } from "use-debounce";
import {
  compareSearchParamBlobs,
  PackageDependenciesListWithPagination,
  searchParamsToBlob,
  type SearchParamsType,
} from "./Required";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.packageVersion
  ) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");

    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      packageVersion: params.packageVersion,
      listing: await dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
      dependencies: await dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        params.packageVersion,
        page === null ? undefined : Number(page)
      ),
    };
  }
  throw new Response("Package version dependencies not found", { status: 404 });
}

export async function clientLoader({ params, request }: LoaderFunctionArgs) {
  if (
    params.communityId &&
    params.namespaceId &&
    params.packageId &&
    params.packageVersion
  ) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");

    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      packageVersion: params.packageVersion,
      listing: dapper.getPackageListingDetails(
        params.communityId,
        params.namespaceId,
        params.packageId
      ),
      dependencies: dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        params.packageVersion,
        page === null ? undefined : Number(page)
      ),
    };
  }
  throw new Response("Package version dependencies not found", { status: 404 });
}

export default function PackageVersionRequired() {
  const {
    communityId,
    namespaceId,
    packageId,
    packageVersion,
    listing,
    dependencies,
  } = useLoaderData<typeof loader | typeof clientLoader>();
  const listingAndDependencies = useMemo(
    () => Promise.all([listing, dependencies]),
    [listing, dependencies]
  );

  const navigationType = useNavigationType();

  const [searchParams, setSearchParams] = useSearchParams();

  const initialParams = searchParamsToBlob(searchParams);

  const [searchParamsBlob, setSearchParamsBlob] =
    useState<SearchParamsType>(initialParams);

  const [currentPage, setCurrentPage] = useState(
    searchParams.get("page") ? Number(searchParams.get("page")) : 1
  );

  const [debouncedSearchParamsBlob] = useDebounce(searchParamsBlob, 300, {
    maxWait: 300,
  });

  const searchParamsBlobRef = useRef(debouncedSearchParamsBlob);

  const searchParamsRef = useRef(searchParams);
  useEffect(() => {
    if (navigationType === "POP") {
      if (searchParamsRef.current !== searchParams) {
        const spb = searchParamsToBlob(searchParams);
        setSearchParamsBlob(spb);
        setCurrentPage(spb.page);
        searchParamsRef.current = searchParams;
      }
      searchParamsBlobRef.current = searchParamsToBlob(searchParams);
    }
  }, [searchParams]);

  useEffect(() => {
    if (
      navigationType !== "POP" ||
      (navigationType === "POP" &&
        searchParamsBlobRef.current !== debouncedSearchParamsBlob)
    ) {
      if (searchParamsBlobRef.current !== debouncedSearchParamsBlob) {
        const oldPage = searchParams.get("page")
          ? Number(searchParams.get("page"))
          : 1;
        // Page number
        if (oldPage !== debouncedSearchParamsBlob.page) {
          if (debouncedSearchParamsBlob.page === 1) {
            searchParams.delete("page");
            setCurrentPage(1);
          } else {
            searchParams.set("page", String(debouncedSearchParamsBlob.page));
            setCurrentPage(debouncedSearchParamsBlob.page);
          }
        }
        const uncommittedSearchParams = searchParamsToBlob(searchParams);

        if (
          navigationType !== "POP" ||
          (navigationType === "POP" &&
            !compareSearchParamBlobs(
              uncommittedSearchParams,
              searchParamsBlobRef.current
            ) &&
            compareSearchParamBlobs(
              uncommittedSearchParams,
              debouncedSearchParamsBlob
            ))
        ) {
          setSearchParams(searchParams, { preventScrollReset: true });
        }
        searchParamsBlobRef.current = debouncedSearchParamsBlob;
      }
    }
  }, [debouncedSearchParamsBlob]);

  return (
    <Suspense fallback={<SkeletonBox className="package-required__skeleton" />}>
      <Await
        resolve={listingAndDependencies}
        errorElement={
          <div>Error occurred while loading required dependencies</div>
        }
      >
        {(resolvedValue) => (
          <>
            <div className="required">
              <div className="required__title">
                <Heading csLevel="3" csSize="3">
                  Required mods ({resolvedValue[0].dependencies.length})
                </Heading>
                <span className="required__description">
                  This package requires the following packages to work.
                </span>
              </div>
              <PackageDependenciesListWithPagination
                page={currentPage}
                pageSize={10}
                communityId={communityId}
                namespaceId={namespaceId}
                packageId={packageId}
                packageVersion={packageVersion}
                dependenciesCount={resolvedValue[1].results.length}
                setPage={setCurrentPage}
                dependencies={resolvedValue[1].results}
              />
            </div>
          </>
        )}
      </Await>
    </Suspense>
  );
}
