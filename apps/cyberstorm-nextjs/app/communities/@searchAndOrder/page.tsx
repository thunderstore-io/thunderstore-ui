"use client";
import styles from "./SearchAndOrder.module.css";
import { TextInput, Select } from "@thunderstore/cyberstorm";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faArrowDownAZ,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faFire } from "@fortawesome/free-solid-svg-icons";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

enum SortOptions {
  Name = "name",
  Latest = "-datetime_created",
  Popular = "-aggregated_fields__package_count",
  MostDownloads = "-aggregated_fields__download_count",
}

export default function Page() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string, isDefault?: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      if (isDefault || value.length === 0) {
        params.delete(name);
      } else {
        params.set(name, value);
      }

      return params.toString();
    },
    [searchParams]
  );

  const [order, setOrder] = useState(SortOptions.Popular);

  const changeOrder = (v: SortOptions) => {
    setOrder(v);
    router.push(
      pathname + "?" + createQueryString("order", v, v === SortOptions.Popular)
    );
  };

  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearchValue] = useDebounce(searchValue, 300);

  useEffect(() => {
    router.push(
      pathname + "?" + createQueryString("search", debouncedSearchValue)
    );
  }, [createQueryString, debouncedSearchValue, pathname, router]);

  return (
    <div className={styles.root}>
      <div className={styles.searchTextInput}>
        <TextInput
          onChange={(e) => setSearchValue(e.target.value)}
          value={searchValue}
          placeholder="Search communities..."
          clearValue={() => setSearchValue("")}
          leftIcon={<FontAwesomeIcon icon={faSearch} />}
        />
      </div>
      <div className={styles.searchFilters}>
        <div className={styles.searchFiltersSortLabel}>Sort by</div>
        <Select onChange={changeOrder} options={selectOptions} value={order} />
      </div>
    </div>
  );
}

const selectOptions = [
  {
    value: SortOptions.Name,
    label: "Name",
    leftIcon: <FontAwesomeIcon icon={faArrowDownAZ} />,
  },
  {
    value: SortOptions.Latest,
    label: "Latest",
    leftIcon: <FontAwesomeIcon icon={faStar} />,
  },
  {
    value: SortOptions.Popular,
    label: "Popular",
    leftIcon: <FontAwesomeIcon icon={faFire} />,
  },
];
