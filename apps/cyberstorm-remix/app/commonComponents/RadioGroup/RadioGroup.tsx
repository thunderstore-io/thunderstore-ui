import { faCircle, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { memo } from "react";

import { NewIcon } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { type Section } from "@thunderstore/dapper/types";

import "./RadioGroup.css";

interface Props {
  sections: Section[];
  selected: string;
  setSelected: (v: string) => void;
}

export const RadioGroup = memo(function RadioGroup(props: Props) {
  const { sections, selected, setSelected } = props;

  return (
    <RadixRadioGroup.Root
      value={selected}
      onValueChange={setSelected}
      className="radio-group"
    >
      {sections.map((s) => (
        <label
          key={s.slug}
          className={classnames(
            "radio-group__label",
            s.uuid === selected
              ? "radio-group__label--selected"
              : "radio-group__label--unselected"
          )}
        >
          {s.name}
          <RadixRadioGroup.Item value={s.uuid} className="radio-group__radio">
            {s.uuid !== selected ? (
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faCircle} />
              </NewIcon>
            ) : undefined}
            <RadixRadioGroup.Indicator asChild>
              <NewIcon csMode="inline" noWrapper>
                <FontAwesomeIcon icon={faCircleDot} />
              </NewIcon>
            </RadixRadioGroup.Indicator>
          </RadixRadioGroup.Item>
        </label>
      ))}
    </RadixRadioGroup.Root>
  );
});

RadioGroup.displayName = "RadioGroup";
