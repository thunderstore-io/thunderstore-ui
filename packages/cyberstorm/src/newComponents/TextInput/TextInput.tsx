import { faXmarkLarge } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { type ReactElement, memo } from "react";

import {
  type TextInputModifiers,
  type TextInputSizes,
  type TextInputVariants,
} from "@thunderstore/cyberstorm-theme/src/components";

import { NewIcon } from "../..";
import { Actionable } from "../../primitiveComponents/Actionable/Actionable";
import { Frame } from "../../primitiveComponents/Frame/Frame";
import {
  Input,
  type InputTextAreaProps,
  type InputTextInputProps,
} from "../../primitiveComponents/Input/Input";
import { classnames, componentClasses } from "../../utils/utils";
import "./TextInput.css";

export interface TextInputProps
  extends Omit<InputTextInputProps, "primitiveType"> {
  leftIcon?: ReactElement;
  rightIcon?: ReactElement;
  enterHook?: (value: string | number | readonly string[]) => string | void;
  clearValue?: () => void;
  csVariant?: TextInputVariants;
  csSize?: TextInputSizes;
  csModifiers?: TextInputModifiers[];
  ref?: React.Ref<HTMLInputElement>;
}

// TODO: Finish the styles conversion to new system
export const TextInput = memo(function TextInput(props: TextInputProps) {
  const {
    children,
    leftIcon,
    rightIcon,
    clearValue,
    enterHook,
    rootClasses,
    csVariant = "primary",
    csSize = "default",
    csModifiers,
    ref,
    ...forwardedProps
  } = props;
  const fProps:
    | Omit<InputTextInputProps, "primitiveType">
    | Omit<InputTextAreaProps, "primitiveType"> = forwardedProps;
  const onEnter = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (fProps.value && enterHook && e.key === "Enter") {
      enterHook(fProps.value);
    }
  };
  // Use correct ref type for input or textarea
  const inputRef = ref as React.Ref<HTMLInputElement> | undefined;
  const textareaRef = ref as React.Ref<HTMLTextAreaElement> | undefined;

  return (
    <Frame
      primitiveType="window"
      rootClasses={classnames(
        "text-input__wrapper",
        ...componentClasses(
          "text-input__wrapper",
          csVariant,
          csSize,
          csModifiers
        ),
        rootClasses
      )}
    >
      {leftIcon ? (
        <NewIcon csMode="inline" noWrapper rootClasses="text-input__left-icon">
          {leftIcon}
        </NewIcon>
      ) : null}
      {csSize === "textarea" ? (
        <Input
          {...(fProps as InputTextAreaProps)}
          primitiveType={"textArea"}
          rootClasses={classnames(
            "text-input",
            leftIcon ? "text-input--has-left-icon" : null,
            clearValue ? "text-input--has-clear-value" : null,
            ...componentClasses("text-input", csVariant, csSize, csModifiers)
          )}
          ref={textareaRef}
          onKeyDown={onEnter}
        >
          {children}
        </Input>
      ) : (
        <Input
          {...(fProps as InputTextInputProps)}
          primitiveType={"textInput"}
          rootClasses={classnames(
            "text-input",
            leftIcon ? "text-input--has-left-icon" : null,
            clearValue ? "text-input--has-clear-value" : null,
            ...componentClasses("text-input", csVariant, csSize, csModifiers)
          )}
          ref={inputRef}
          onKeyDown={onEnter}
        >
          {children}
        </Input>
      )}
      {clearValue && fProps.value !== "" ? (
        <Actionable
          primitiveType="button"
          onClick={() => clearValue()}
          rootClasses={classnames(
            "text-input__clear-value-button",
            ...componentClasses(
              "text-input__clear-value-button",
              csVariant,
              csSize,
              csModifiers
            )
          )}
          tooltipText="Clear"
          tooltipSide="left"
          aria-label="Clear search input"
        >
          <NewIcon csMode="inline" noWrapper>
            <FontAwesomeIcon icon={faXmarkLarge} />
          </NewIcon>
        </Actionable>
      ) : null}
    </Frame>
  );
});

// export const TextInput = React.forwardRef<HTMLInputElement, TextInputProps>(
//   (props: TextInputProps, forwardedRef) => {
//     const {
//       children,
//       leftIcon,
//       rightIcon,
//       clearValue,
//       enterHook,
//       rootClasses,
//       csVariant = "primary",
//       csSize = "default",
//       csModifiers,
//       ...forwardedProps
//     } = props;
//     const fProps = forwardedProps as InputTextInputProps;
//     const onEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (fProps.value && enterHook && e.key === "Enter") {
//         enterHook(fProps.value);
//       }
//     };
//     return (
//       <Frame
//         primitiveType="window"
//         rootClasses={classnames(
//           "text-input__wrapper",
//           ...componentClasses(
//             "text-input__wrapper",
//             csVariant,
//             csSize,
//             csModifiers
//           ),
//           rootClasses
//         )}
//       >
//         {leftIcon ? (
//           <NewIcon
//             csMode="inline"
//             noWrapper
//             rootClasses="text-input__left-icon"
//           >
//             {leftIcon}
//           </NewIcon>
//         ) : null}
//         <Input
//           {...fProps}
//           primitiveType={"textInput"}
//           rootClasses={classnames(
//             "text-input",
//             leftIcon ? "text-input--has-left-icon" : null,
//             clearValue ? "text-input--has-clear-value" : null,
//             ...componentClasses("text-input", csVariant, csSize, csModifiers)
//           )}
//           ref={forwardedRef}
//           onKeyDown={onEnter}
//         >
//           {children}
//         </Input>
//         {clearValue && fProps.value !== "" ? (
//           <Actionable
//             primitiveType="button"
//             onClick={() => clearValue()}
//             rootClasses={classnames(
//               "text-input__clear-value-button",
//               ...componentClasses(
//                 "text-input__clear-value-button",
//                 csVariant,
//                 csSize,
//                 csModifiers
//               )
//             )}
//             tooltipText="Clear"
//             tooltipSide="left"
//             aria-label="Clear search input"
//           >
//             <NewIcon csMode="inline" noWrapper>
//               <FontAwesomeIcon icon={faXmarkLarge} />
//             </NewIcon>
//           </Actionable>
//         ) : null}
//       </Frame>
//     );
//   }
// );

TextInput.displayName = "TextInput";
