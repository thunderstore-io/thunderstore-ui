import "./Required.css";
import { Heading, NewPagination, SkeletonBox } from "@thunderstore/cyberstorm";
import {
  Await,
  useNavigationType,
  useSearchParams,
  type LoaderFunctionArgs,
} from "react-router";
import { useLoaderData } from "react-router";
import { ListingDependency } from "~/commonComponents/ListingDependency/ListingDependency";
import { DapperTs } from "@thunderstore/dapper-ts";
import {
  getPublicEnvVariables,
  getSessionTools,
} from "cyberstorm/security/publicEnvVariables";
import { Suspense, useEffect, useRef, useState } from "react";
import type { PackageVersionDependency } from "@thunderstore/dapper/types";
import { useDebounce } from "use-debounce";

export async function loader({ params, request }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const publicEnvVariables = getPublicEnvVariables(["VITE_API_URL"]);
    const dapper = new DapperTs(() => {
      return {
        apiHost: publicEnvVariables.VITE_API_URL,
        sessionId: undefined,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");

    const listing = await dapper.getPackageListingDetails(
      params.communityId,
      params.namespaceId,
      params.packageId
    );

    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      packageVersion: listing.latest_version_number,
      listing: listing,
      dependencies: await dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        listing.latest_version_number,
        page === null ? undefined : Number(page)
      ),
    };
  }
  throw new Response("Package version dependencies not found", { status: 404 });
}

export async function clientLoader({ params, request }: LoaderFunctionArgs) {
  if (params.communityId && params.namespaceId && params.packageId) {
    const tools = getSessionTools();
    const dapper = new DapperTs(() => {
      return {
        apiHost: tools?.getConfig().apiHost,
        sessionId: tools?.getConfig().sessionId,
      };
    });
    const searchParams = new URL(request.url).searchParams;
    const page = searchParams.get("page");

    const listing = await dapper.getPackageListingDetails(
      params.communityId,
      params.namespaceId,
      params.packageId
    );

    return {
      communityId: params.communityId,
      namespaceId: params.namespaceId,
      packageId: params.packageId,
      packageVersion: listing.latest_version_number,
      listing: listing,
      dependencies: dapper.getPackageVersionDependencies(
        params.namespaceId,
        params.packageId,
        listing.latest_version_number,
        page === null ? undefined : Number(page)
      ),
    };
  }
  throw new Response("Package version dependencies not found", { status: 404 });
}

export default function Required() {
  const {
    communityId,
    namespaceId,
    packageId,
    packageVersion,
    listing,
    dependencies,
  } = useLoaderData<typeof loader | typeof clientLoader>();

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
        resolve={dependencies}
        errorElement={
          <div>Error occurred while loading required dependencies</div>
        }
      >
        {(resolvedValue) => (
          <>
            <div className="required">
              <div className="required__title">
                <Heading csLevel="3" csSize="3">
                  Required mods ({listing.dependency_count})
                </Heading>
                <span className="required__description">
                  This package requires the following packages to work.
                </span>
              </div>
              <PackageDependenciesListWithPagination
                page={currentPage}
                pageSize={20}
                communityId={communityId}
                namespaceId={namespaceId}
                packageId={packageId}
                packageVersion={packageVersion}
                dependenciesCount={listing.dependency_count}
                onPageChange={setParamsBlobValue(
                  setSearchParamsBlob,
                  searchParamsBlob,
                  "page"
                )}
                dependencies={resolvedValue.results}
              />
            </div>
          </>
        )}
      </Await>
    </Suspense>
  );
}

export function PackageDependenciesListWithPagination(props: {
  page: number;
  pageSize: number;
  communityId: string;
  namespaceId: string;
  packageId: string;
  packageVersion: string;
  dependenciesCount: number;
  onPageChange: (page: number) => void;
  dependencies: PackageVersionDependency[];
}) {
  return (
    <>
      <div className="required__body">
        {props.dependencies.map((dep, key) => {
          return <ListingDependency key={key} dependency={dep} />;
        })}
      </div>
      <NewPagination
        currentPage={props.page}
        pageSize={props.pageSize}
        totalCount={props.dependenciesCount}
        onPageChange={props.onPageChange}
        siblingCount={4}
      />
    </>
  );
}

export type SearchParamsType = {
  page: number;
};

export const compareSearchParamBlobs = (
  b1: SearchParamsType,
  b2: SearchParamsType
) => {
  if (b1.page !== b2.page) return false;
  return true;
};

export const searchParamsToBlob = (searchParams: URLSearchParams) => {
  const initialPage = searchParams.get("page");

  return {
    page:
      initialPage &&
      !Number.isNaN(Number.parseInt(initialPage)) &&
      Number.isSafeInteger(Number.parseInt(initialPage))
        ? Number.parseInt(initialPage)
        : 1,
  };
};

export function setParamsBlobValue<K extends keyof SearchParamsType>(
  setter: (v: SearchParamsType) => void,
  oldBlob: SearchParamsType,
  key: K
) {
  return (v: SearchParamsType[K]) => setter({ ...oldBlob, [key]: v });
}
