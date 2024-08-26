import {
  faClock,
  faDownload,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faHandSparkles } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

import { Select } from "@thunderstore/cyberstorm";

interface Props {
  order: PackageOrderOptions;
  setOrder: Dispatch<SetStateAction<PackageOrderOptions>>;
}

export const PackageOrder = (props: Props) => (
  <Select
    options={selectOptions}
    value={props.order}
    onChange={props.setOrder}
    id="packageOrder"
  />
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
    leftIcon: <FontAwesomeIcon icon={faHandSparkles} />,
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
