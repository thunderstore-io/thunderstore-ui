import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import { Section } from "@thunderstore/dapper/types";
import { faCircle, faCircleDot } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./RadioGroup.css";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { NewIcon } from "@thunderstore/cyberstorm";

interface Props {
  allSections: Section[];
  selected: string;
  setSelected: (v: string) => void;
}

export const RadioGroup = (props: Props) => {
  const { allSections, selected, setSelected } = props;

  return (
    <RadixRadioGroup.Root
      value={selected}
      onValueChange={setSelected}
      className="nimbus-commonComponents-radioGroup"
    >
      {allSections.map((s) => (
        <label
          key={s.slug}
          className={classnames(
            "nimbus-commonComponents-radioGroup__label",
            s.uuid === selected
              ? "nimbus-commonComponents-radioGroup__label--selected"
              : "nimbus-commonComponents-radioGroup__label--unselected"
          )}
        >
          {s.name}
          <RadixRadioGroup.Item
            value={s.uuid}
            className="nimbus-commonComponents-radioGroup-radio"
          >
            {s.uuid !== selected ? (
              <NewIcon
                csMode="inline"
                noWrapper
                rootClasses="nimbus-commonComponents-radioGroup-radio__radioIndicator"
              >
                <FontAwesomeIcon icon={faCircle} />
              </NewIcon>
            ) : undefined}
            <RadixRadioGroup.Indicator asChild>
              <NewIcon
                csMode="inline"
                noWrapper
                rootClasses="nimbus-commonComponents-radioGroup-radio__radioIndicator"
              >
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
