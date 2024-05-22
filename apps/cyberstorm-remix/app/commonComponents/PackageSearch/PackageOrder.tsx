import {
  faClock,
  faDownload,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faSparkles } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

import styles from "./PackageList.module.css";
import { Select } from "@thunderstore/cyberstorm";

interface Props {
  order: PackageOrderOptions;
  setOrder: Dispatch<SetStateAction<PackageOrderOptions>>;
}

export const PackageOrder = (props: Props) => (
  <label className={styles.order}>
    <p className={styles.sortByText}>Sort By</p>
    <Select
      options={selectOptions}
      value={props.order}
      onChange={props.setOrder}
    />
  </label>
);

export enum PackageOrderOptions {
  Created = "newest",
  Downloaded = "most-downloaded",
  Rated = "top-rated",
  Updated = "last-updated",
}

const selectOptions = [
  {
    value: PackageOrderOptions.Updated,
    label: "Last updated",
    leftIcon: <FontAwesomeIcon icon={faClock} />,
  },
  {
    value: PackageOrderOptions.Created,
    label: "Newest",
    leftIcon: <FontAwesomeIcon icon={faSparkles} />,
  },
  {
    value: PackageOrderOptions.Downloaded,
    label: "Most downloaded",
    leftIcon: <FontAwesomeIcon icon={faDownload} />,
  },
  {
    value: PackageOrderOptions.Rated,
    label: "Top rated",
    leftIcon: <FontAwesomeIcon icon={faThumbsUp} />,
  },
];

PackageOrder.displayName = "PackageOrder";
