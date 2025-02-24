import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Section } from "@thunderstore/dapper/types";
import { faCircle, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./RadioGroup.css";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { NewIcon } from "@thunderstore/cyberstorm";

interface Props {
  sections: Section[];
  selected: string;
  setSelected: (v: string) => void;
}

export const RadioGroup = (props: Props) => {
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
};

RadioGroup.displayName = "RadioGroup";
