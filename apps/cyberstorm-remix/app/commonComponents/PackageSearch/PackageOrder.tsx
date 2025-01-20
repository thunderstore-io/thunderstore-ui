import {
  faClockRotateLeft,
  faDownload,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faSparkles } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NewSelect } from "@thunderstore/cyberstorm";

interface Props {
  order: PackageOrderOptionsType;
  setOrder: (val: PackageOrderOptionsType) => void;
}

export const PackageOrder = (props: Props) => (
  <NewSelect
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
export type PackageOrderOptionsType = `${PackageOrderOptions}`;

export function isPackageOrderOptions(value: string) {
  const enumValues = Object.values(PackageOrderOptions) as string[];
  return enumValues.includes(value);
}

const selectOptions = [
  {
    value: PackageOrderOptions.Updated,
    label: "Last updated",
    leftIcon: <FontAwesomeIcon icon={faClockRotateLeft} />,
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
