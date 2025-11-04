import "./PaginatedDependencies.css";
import { Heading, NewPagination } from "@thunderstore/cyberstorm";
import { ListingDependency } from "../ListingDependency/ListingDependency";
import { useSearchParams } from "react-router";
import { type PackageVersionDependency } from "@thunderstore/thunderstore-api";

interface DependecyResponse {
  results: PackageVersionDependency[];
  count: number;
}

interface Props {
  dependencies: DependecyResponse;
  pageSize?: number;
  siblingCount?: number;
}

export function PaginatedDependencies({
  dependencies,
  pageSize = 20, // Default page size from backend
  siblingCount = 4,
}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);

  const handlePageChange = (nextPage: number) => {
    const next = new URLSearchParams(searchParams);

    if (nextPage === 1) {
      next.delete("page");
    } else {
      next.set("page", String(nextPage));
    }

    setSearchParams(next, { preventScrollReset: true });
  };

  return (
    <div className="paginated-dependencies">
      <div className="paginated-dependencies__title">
        <Heading csLevel="3" csSize="3">
          Required mods ({dependencies.count})
        </Heading>
        <span className="paginated-dependencies__description">
          This package requires the following packages to work.
        </span>
      </div>

      <div className="paginated-dependencies__body">
        {dependencies.results.map((dep, idx: number) => (
          <ListingDependency
            key={`${dep.name}-${dep.version_number}-${idx}`}
            dependency={dep}
          />
        ))}
      </div>

      <NewPagination
        currentPage={page}
        pageSize={pageSize}
        totalCount={dependencies.count}
        onPageChange={handlePageChange}
        siblingCount={siblingCount}
      />
    </div>
  );
}

PaginatedDependencies.displayName = "PaginatedDependencies";
