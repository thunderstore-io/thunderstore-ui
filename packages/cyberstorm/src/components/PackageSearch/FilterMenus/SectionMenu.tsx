import * as RadioGroup from "@radix-ui/react-radio-group";
import { Section } from "@thunderstore/dapper/types";
import { Dispatch, SetStateAction } from "react";

import styles from "./FilterMenu.module.css";
import { classnames } from "../../../utils/utils";

interface Props {
  allSections: Section[];
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
}

/**
 * Allow filtering packages by sections on PackageSearch.
 */
export const SectionMenu = (props: Props) => {
  const { allSections, selected, setSelected } = props;

  if (!allSections.length) {
    return null;
  }

  return (
    <div className={styles.root}>
      <h2 className={styles.header}>Sections</h2>

      <RadioGroup.Root value={selected} onValueChange={setSelected}>
        {allSections.map((s) => (
          <label
            key={s.slug}
            className={classnames(
              styles.label,
              s.slug === selected ? styles.include : null
            )}
          >
            <RadioGroup.Item
              value={s.slug}
              className={classnames(
                styles.radio,
                s.slug === selected ? styles.radioSelected : null
              )}
            >
              <RadioGroup.Indicator className={styles.radioIndicator} />
            </RadioGroup.Item>
            {s.name}
          </label>
        ))}
      </RadioGroup.Root>
    </div>
  );
};

SectionMenu.displayName = "SectionMenu";
