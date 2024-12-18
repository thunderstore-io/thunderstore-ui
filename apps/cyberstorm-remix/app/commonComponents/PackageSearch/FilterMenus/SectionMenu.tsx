import * as RadioGroup from "@radix-ui/react-radio-group";
import { Section } from "@thunderstore/dapper/types";
import { faCircle, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./FilterMenu.module.css";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { NewIcon } from "@thunderstore/cyberstorm";

interface Props {
  allSections: Section[];
  selected: string;
  setSelected: (v: string) => void;
}

/**
 * Allow filtering packages by sections on PackageSearch.
 */
export const SectionMenu = (props: Props) => {
  const { allSections, selected, setSelected } = props;

  return (
    <RadioGroup.Root value={selected} onValueChange={setSelected}>
      {allSections.map((s) => (
        <label
          key={s.slug}
          className={classnames(
            styles.label,
            s.uuid === selected ? styles.selected : styles.unselected
          )}
        >
          {s.name}
          <RadioGroup.Item value={s.uuid} className={styles.radio}>
            {s.uuid !== selected ? (
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faCircle} />
              </NewIcon>
            ) : undefined}
            <RadioGroup.Indicator asChild>
              <NewIcon
                csMode="inline"
                noWrapper
                rootClasses={styles.radioIndicator}
              >
                <FontAwesomeIcon icon={faCircleDot} />
              </NewIcon>
            </RadioGroup.Indicator>
          </RadioGroup.Item>
        </label>
      ))}
      <label
        key={"all"}
        className={classnames(
          styles.label,
          selected === "all" ? styles.selected : styles.unselected
        )}
      >
        All
        <RadioGroup.Item value={"all"} className={styles.radio}>
          {selected !== "all" ? (
            <NewIcon csMode="inline" noWrapper>
              <FontAwesomeIcon icon={faCircle} />
            </NewIcon>
          ) : undefined}
          <RadioGroup.Indicator asChild>
            <NewIcon
              csMode="inline"
              noWrapper
              rootClasses={styles.radioIndicator}
            >
              <FontAwesomeIcon icon={faCircleDot} />
            </NewIcon>
          </RadioGroup.Indicator>
        </RadioGroup.Item>
      </label>
    </RadioGroup.Root>
  );
};

SectionMenu.displayName = "SectionMenu";
