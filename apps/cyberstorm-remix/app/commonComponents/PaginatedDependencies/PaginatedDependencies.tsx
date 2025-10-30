import { memo, Suspense, useEffect, useMemo, useRef, useState } from "react";
import "./PaginatedDependencies.css";
import { Heading, NewPagination, SkeletonBox } from "@thunderstore/cyberstorm";
import { ListingDependency } from "../ListingDependency/ListingDependency";
import { Await, useNavigationType, useSearchParams } from "react-router";
import { useDebounce } from "use-debounce";
import type { getPackageVersionDetails } from "@thunderstore/dapper-ts/src/methods/packageVersion";
import type { getPackageVersionDependencies } from "@thunderstore/dapper-ts/src/methods/package";
import { setParamsBlobValue } from "cyberstorm/utils/searchParamsUtils";

interface Props {
  version:
    | Awaited<ReturnType<typeof getPackageVersionDetails>>
    | ReturnType<typeof getPackageVersionDetails>;
  dependencies:
    | Awaited<ReturnType<typeof getPackageVersionDependencies>>
    | ReturnType<typeof getPackageVersionDependencies>;
  pageSize?: number;
  siblingCount?: number;
}

export const PaginatedDependencies = memo(function PaginatedDependencies(
  props: Props
) {
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

  const versionAndDependencies = useMemo(
    () => Promise.all([props.version, props.dependencies]),
    [currentPage, props.version, props.dependencies]
  );

  return (
    <div className="paginated-dependencies">
      <Suspense
        fallback={<SkeletonBox className="paginated-dependencies__skeleton" />}
      >
        <Await resolve={versionAndDependencies}>
          {(resolvedValue) => {
            return (
              <>
                <div className="paginated-dependencies__title">
                  <Heading csLevel="3" csSize="3">
                    Required mods ({resolvedValue[0].dependency_count})
                  </Heading>
                  <span className="paginated-dependencies__description">
                    This package requires the following packages to work.
                  </span>
                </div>
                <div className="paginated-dependencies__body">
                  {resolvedValue[1].results.map((dep, key) => {
                    return <ListingDependency key={key} dependency={dep} />;
                  })}
                </div>
                <NewPagination
                  currentPage={currentPage}
                  pageSize={props.pageSize ?? 20}
                  totalCount={resolvedValue[0].dependency_count}
                  onPageChange={setParamsBlobValue(
                    setSearchParamsBlob,
                    searchParamsBlob,
                    "page"
                  )}
                  siblingCount={props.siblingCount ?? 4}
                />
              </>
            );
          }}
        </Await>
      </Suspense>
    </div>
  );
});

PaginatedDependencies.displayName = "PaginatedDependencies";

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
