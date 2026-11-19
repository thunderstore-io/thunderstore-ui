import {
  faClockRotateLeft,
  faDownload,
  faFire,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";
import { faSparkle, faStars } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { isTrendingSortEnabled } from "cyberstorm/utils/env";

import { NewSelect } from "@thunderstore/cyberstorm";

import {
  PackageOrderOptions,
  type PackageOrderOptionsType,
} from "./packageOrderOptions";

interface Props {
  order: PackageOrderOptionsType;
  setOrder: (val: PackageOrderOptionsType) => void;
}

export const PackageOrder = (props: Props) => (
  <NewSelect
    options={isTrendingSortEnabled() ? trendingSelectOptions : selectOptions}
    value={props.order}
    onChange={props.setOrder}
    id="packageOrder"
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
    leftIcon: <FontAwesomeIcon icon={faSparkle} />,
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

const trendingSelectOptions = [
  {
    value: PackageOrderOptions.Trending,
    label: "Trending",
    leftIcon: <FontAwesomeIcon icon={faFire} />,
  },
  {
    value: PackageOrderOptions.NewAndTrending,
    label: "New & Trending",
    leftIcon: <FontAwesomeIcon icon={faStars} />,
  },
  ...selectOptions,
];

PackageOrder.displayName = "PackageOrder";
