import { Select, MultiSelect } from "@thunderstore/components";
import React from "react";

const options = [
  { label: "Option 1", value: "option-1" },
  { label: "Option 2", value: "option-2" },
  { label: "Option 3", value: "option-3" },
];

export const SingleSelect_: React.FC<never> = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return <Select options={options} onChange={() => {}} />;
};

export const MultiSelect_: React.FC<never> = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  return <MultiSelect options={options} onChange={() => {}} />;
};

export default {
  title: "Components/Select",
};
