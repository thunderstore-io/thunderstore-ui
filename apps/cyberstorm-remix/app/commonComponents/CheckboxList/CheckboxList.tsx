import {
  faSquare,
  faSquareCheck,
  faSquareXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./CheckboxList.css";
import { CycleButton, NewIcon } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";
import { resolveTriState } from "~/commonComponents/utils";
import { TRISTATE } from "~/commonComponents/types";

type typeA<B> = (v: B) => void;

interface Props {
  items: {
    state: boolean | TRISTATE;
    setStateFunc: typeA<boolean | TRISTATE>;
    label: string;
  }[];
}

const nextStateResolve = (state: TRISTATE | boolean) =>
  typeof state === "string" ? resolveTriState(state) : !state;

const currentState = (state: TRISTATE | boolean) =>
  typeof state === "string" ? state : state ? "include" : "off";

/**
 * CheckboxList which supports boolean and tri-state "checkboxes"
 */
export const CheckboxList = (props: Props) => {
  const { items } = props;

  return (
    <ol className="nimbus-commonComponents-checkboxList">
      {items.map((item) => {
        const cs = currentState(item.state);
        return (
          <li key={item.label}>
            <label
              className={classnames(
                "nimbus-commonComponents-checkboxList-label",
                `nimbus-commonComponents-checkboxList-label--${cs}`
              )}
            >
              {item.label}
              <CycleButton
                onInteract={() => {
                  item.setStateFunc(nextStateResolve(item.state));
                }}
                rootClasses="nimbus-commonComponents-checkboxList-label__checkbox"
                value={`nimbus-commonComponents-checkboxList-label--${cs}`}
                noState
              >
                <NewIcon csMode="inline" noWrapper>
                  <FontAwesomeIcon
                    icon={
                      cs === "include"
                        ? faSquareCheck
                        : cs === "exclude"
                          ? faSquareXmark
                          : faSquare
                    }
                  />
                </NewIcon>
              </CycleButton>
            </label>
          </li>
        );
      })}
    </ol>
  );
};

CheckboxList.displayName = "CheckboxList";
