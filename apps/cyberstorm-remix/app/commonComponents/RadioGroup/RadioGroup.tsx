import { faCircle, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Fragment, memo } from "react";

import { NewIcon, classnames } from "@thunderstore/cyberstorm";
import { type Section } from "@thunderstore/dapper/types";

interface Props {
  sections: Section[];
  selected: string;
  setSelected: (v: string) => void;
  dividerAfterUuid?: string;
}

export const RadioGroup = memo(function RadioGroup(props: Props) {
  const { sections, selected, setSelected, dividerAfterUuid } = props;

  return (
    <RadixRadioGroup.Root
      value={selected}
      onValueChange={setSelected}
      className="radio-group"
    >
      {sections.map((s, index) => (
        <Fragment key={s.slug}>
          <label
            className={classnames(
              "radio-group__label",
              s.uuid === selected
                ? "radio-group__label--selected"
                : "radio-group__label--unselected"
            )}
          >
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
            {s.name}
          </label>
          {s.uuid === dividerAfterUuid && index < sections.length - 1 ? (
            <div className="radio-group__divider" role="presentation" />
          ) : null}
        </Fragment>
      ))}
    </RadixRadioGroup.Root>
  );
});

RadioGroup.displayName = "RadioGroup";
