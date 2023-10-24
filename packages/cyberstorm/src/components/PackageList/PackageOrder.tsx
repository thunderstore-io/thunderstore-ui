import {
  faClock,
  faDownload,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faSparkles } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

import styles from "./PackageList.module.css";
import { Icon } from "../Icon/Icon";
import { Select } from "../Select/Select";

interface Props {
  order: PackageOrderOptions;
  setOrder: Dispatch<SetStateAction<PackageOrderOptions>>;
}

export const PackageOrder = (props: Props) => (
  <label className={styles.order}>
    Sort By
    <Select
      options={selectOptions}
      value={props.order}
      onChange={props.setOrder}
    />
  </label>
);

export enum PackageOrderOptions {
  Created = "-datetime_created",
  Downloaded = "-downloads",
  Rated = "-rating_score",
  Updated = "-datetime_updated",
}

const selectOptions = [
  {
    value: PackageOrderOptions.Updated,
    label: "Last updated",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faClock} />
      </Icon>
    ),
  },
  {
    value: PackageOrderOptions.Created,
    label: "Newest",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faSparkles} />
      </Icon>
    ),
  },
  {
    value: PackageOrderOptions.Downloaded,
    label: "Most downloaded",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faDownload} />
      </Icon>
    ),
  },
  {
    value: PackageOrderOptions.Rated,
    label: "Top rated",
    leftIcon: (
      <Icon>
        <FontAwesomeIcon icon={faThumbsUp} />
      </Icon>
    ),
  },
];

PackageOrder.displayName = "PackageOrder";
