import { Dispatch, SetStateAction } from "react";

import { Select } from "@thunderstore/cyberstorm";

interface Props {
  value: PackageRecentOptions;
  setValue: Dispatch<SetStateAction<PackageRecentOptions>>;
  id: string;
}

export const PackageRecent = (props: Props) => (
  <Select
    options={selectOptions}
    value={props.value}
    onChange={props.setValue}
    id={props.id}
  />
);

export enum PackageRecentOptions {
  OneDay = "1",
  TwoDays = "2",
  SevenDays = "7",
  ThirtyDays = "30",
  ThreeHundredSixtyFiveDays = "365",
  AllTime = "0",
}

const selectOptions = [
  {
    value: PackageRecentOptions.OneDay,
    label: "1 Day",
  },
  {
    value: PackageRecentOptions.TwoDays,
    label: "2 Days",
  },
  {
    value: PackageRecentOptions.SevenDays,
    label: "7 Days",
  },
  {
    value: PackageRecentOptions.ThirtyDays,
    label: "30 Days",
  },
  {
    value: PackageRecentOptions.ThreeHundredSixtyFiveDays,
    label: "365 Days",
  },
  {
    value: PackageRecentOptions.AllTime,
    label: "All time",
  },
];

PackageRecent.displayName = "PackageRecent";
