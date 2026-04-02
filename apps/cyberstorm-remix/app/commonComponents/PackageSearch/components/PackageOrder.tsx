import {
  faClockRotateLeft,
  faDownload,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faSparkles } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { NewSelect } from "@thunderstore/cyberstorm";

import {
  PackageOrderOptions,
  type PackageOrderOptionsType,
} from "./packageOrderOptions";

interface Props {
  order: PackageOrderOptionsType;
  setOrder: (val: PackageOrderOptionsType) => void;
  id?: string;
}

export const PackageOrder = (props: Props) => (
  <NewSelect
    options={selectOptions}
    value={props.order}
    onChange={props.setOrder}
    id={props.id ?? "packageOrder"}
  />
);

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
