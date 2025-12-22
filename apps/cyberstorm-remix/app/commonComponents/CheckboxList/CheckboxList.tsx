import {
  faBan,
  faSquare,
  faSquareCheck,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo } from "react";
import { type TRISTATE } from "~/commonComponents/types";

import { Actionable, NewIcon } from "@thunderstore/cyberstorm";
import { classnames } from "@thunderstore/cyberstorm/src/utils/utils";

import "./CheckboxList.css";

type typeA<B> = (v: B) => void;

interface Props {
  items: {
    state: boolean | TRISTATE;
    setStateFunc: typeA<boolean | TRISTATE>;
    label: string;
  }[];
}

const currentState = (state: TRISTATE | boolean) =>
  typeof state === "string" ? state : state ? "include" : "off";

/**
 * CheckboxList which supports boolean and tri-state "checkboxes"
 */
export const CheckboxList = memo(function CheckboxList(props: Props) {
  const { items } = props;

  return (
    <ol className="checkbox-list">
      {items.map((item) => {
        const cs = currentState(item.state);
        return (
          <li key={item.label}>
            <label
              className={classnames(
                "checkbox-list__label",
                `checkbox-list__label--${cs}`
              )}
              htmlFor={`checkbox-list__checkbox__${item.label}`}
            >
              <span>
                <Actionable
                  primitiveType={"button"}
                  onClick={() => {
                    if (typeof item.state === "string") {
                      item.setStateFunc(
                        item.state !== "include" ? "include" : "off"
                      );
                    } else {
                      item.setStateFunc(!item.state);
                    }
                  }}
                  rootClasses="checkbox-list__icon checkbox-list__checkbox-button"
                  id={`checkbox-list__checkbox__${item.label}`}
                >
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon
                      icon={cs === "include" ? faSquareCheck : faSquare}
                    />
                  </NewIcon>
                </Actionable>
                {item.label}
              </span>
              {typeof item.state === "string" && (
                <Actionable
                  primitiveType={"button"}
                  onClick={() => {
                    if (item.state === "exclude") {
                      item.setStateFunc("off");
                    } else {
                      item.setStateFunc("exclude");
                    }
                  }}
                  rootClasses="checkbox-list__icon checkbox-list__exclude-button"
                >
                  <NewIcon csMode="inline" noWrapper>
                    <FontAwesomeIcon icon={faBan} />
                  </NewIcon>
                </Actionable>
              )}
            </label>
          </li>
        );
      })}
    </ol>
  );
});

CheckboxList.displayName = "CheckboxList";
