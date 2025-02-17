import "./CodeInput.css";
import validationBarStyles from "./ValidationBar.module.css";
import React, { useRef, useState } from "react";
import {
  Input,
  InputTextAreaProps,
} from "../../primitiveComponents/Input/Input";
import { classnames, componentClasses } from "../../utils/utils";
import { NewIcon } from "../..";
import {
  CodeInputVariants,
  CodeInputSizes,
  CodeInputModifiers,
} from "@thunderstore/cyberstorm-theme/src/components";
import {
  faPenToSquare,
  faArrowsRotate,
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface CodeInputProps
  extends Omit<InputTextAreaProps, "primitiveType"> {
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  enterHook?: (value: string | number | readonly string[]) => string | void;
  validationBarProps?: {
    status: "failure" | "success" | "waiting" | "processing";
    message?: string;
  };
  csVariant?: CodeInputVariants;
  csSize?: CodeInputSizes;
  csModifiers?: CodeInputModifiers[];
}

// TODO: Finish the styles conversion to new system
export const CodeInput = React.forwardRef<HTMLTextAreaElement, CodeInputProps>(
  (props: CodeInputProps, forwardedRef) => {
    const {
      children,
      enterHook,
      rootClasses,
      validationBarProps,
      csVariant = "primary",
      csSize = "default",
      csModifiers,
      ...forwardedProps
    } = props;
    const fRef = forwardedRef as React.ForwardedRef<HTMLTextAreaElement>;
    const fProps = forwardedProps as InputTextAreaProps;
    const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (fProps.value && enterHook && e.key === "Enter") {
        enterHook(fProps.value);
      }
    };

    const taRef = useRef<HTMLTextAreaElement | null>(null);
    const gutterRef = useRef<HTMLDivElement | null>(null);

    // const parseValue = (v: string) =>
    //   v.endsWith("px") ? parseInt(v.slice(0, -2), 10) : 0;

    // const calculateNumLines = (
    //   sentence: string,
    //   textareaWidth: number,
    //   context: CanvasRenderingContext2D
    // ) => {
    //   let lineCount = 0;
    //   if (sentence.trim() !== "") lineCount++;
    //   for (
    //     let i = 1;
    //     // eslint-disable-next-line prettier/prettier
    //     i < context.measureText(sentence).width / textareaWidth;
    //     i++
    //   ) {
    //     lineCount++;
    //   }
    //   console.log(context.measureText(sentence).width);
    //   console.log(textareaWidth);
    //   console.log(context.measureText(sentence).width / textareaWidth);
    //   console.log(lineCount);

    //   return lineCount;
    // };

    // const [observer, setObserver] = useState<ResizeObserver>();
    // const [isRunning, setIsRunning] = useState(false);
    // const [isObserving, setIsObserving] = useState(false);

    // const initObserver = (
    //   taRef: React.MutableRefObject<HTMLTextAreaElement | null>,
    //   gutterRef: React.MutableRefObject<HTMLDivElement | null>
    // ) => {
    //   console.log("asd2");
    //   if (taRef && taRef.current && gutterRef && gutterRef.current) {
    //     const textAreaStyles = window.getComputedStyle(taRef.current);

    //     const textAreaWidth =
    //       taRef.current.getBoundingClientRect().width -
    //       parseValue(textAreaStyles.paddingLeft) -
    //       parseValue(textAreaStyles.paddingRight);

    //     const canvas = document.createElement("canvas");
    //     const context = canvas.getContext("2d");
    //     if (context) {
    //       context.font = `${textAreaStyles.fontSize} ${textAreaStyles.fontFamily}`;
    //     }

    //     const entriesSeen = new Set(); // set of entries to skip initial resize call

    //     console.log("123123");
    //     const ro = new ResizeObserver((entries) => {
    //       // console.log(entries);
    //       // console.log(taRef.current);

    //       for (const entry of entries) {
    //         if (!entriesSeen.has(entry.target)) {
    //           // do nothing during initial call
    //           // just mark element as seen
    //           entriesSeen.add(entry.target);
    //         } else {
    //           // console.log(entry.target);
    //           console.log("resize detected");
    //         }
    //       }
    //       if (taRef.current && gutterRef.current && context) {
    //         const rect = taRef.current.getBoundingClientRect();
    //         gutterRef.current.style.height = `${rect.height}px`;

    //         const lines = taRef.current.value.split("\n");
    //         const numLines = lines.map((line) =>
    //           calculateNumLines(line, textAreaWidth, context)
    //         );
    //         console.log(numLines);
    //         const lineNumbers: string[] = [];
    //         let i = 1;
    //         while (numLines.length > 0) {
    //           const numLinesOfSentence = numLines.shift();
    //           lineNumbers.push(String(i));
    //           if (numLinesOfSentence && numLinesOfSentence > 1) {
    //             Array(numLinesOfSentence - 1)
    //               .fill(" ")
    //               // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //               .forEach((_) => lineNumbers.push(" "));
    //           }
    //           i++;
    //         }
    //         console.log(lineNumbers);
    //         gutterRef.current.innerHTML = Array.from(
    //           {
    //             length: lineNumbers.length,
    //           },
    //           (_, i) => `<div>${lineNumbers[i] || "&nbsp;"}</div>`
    //         ).join("");
    //       }
    //     });
    //     setObserver(ro);
    //   }
    // };

    // React.useEffect(() => {
    //   if (!observer) initObserver(taRef, gutterRef);
    //   if (taRef && taRef.current) {
    //     observer?.observe(taRef.current);
    //     setIsObserving(true);
    //   }
    //   console.log("isObserving", isObserving);
    //   if (
    //     taRef &&
    //     gutterRef &&
    //     taRef.current &&
    //     gutterRef.current &&
    //     !isRunning
    //   ) {
    //     taRef.current.addEventListener("scroll", () => {
    //       if (taRef && taRef.current && gutterRef && gutterRef.current)
    //         gutterRef.current.scrollTop = taRef.current.scrollTop;
    //     });
    //     setIsRunning(true);
    //   }
    // }, [fProps.value]);

    React.useEffect(() => {
      document.addEventListener("DOMContentLoaded", () => {
        console.log("asd");
        if (taRef && taRef.current && gutterRef && gutterRef.current) {
          const textarea = taRef.current;
          const lineNumbersEle = gutterRef.current;

          const textareaStyles = window.getComputedStyle(textarea);
          [
            "fontFamily",
            "fontSize",
            "fontWeight",
            "letterSpacing",
            "lineHeight",
            "padding",
          ].forEach((property) => {
            lineNumbersEle.style[property] = textareaStyles[property];
          });

          const parseValue = (v: string) =>
            v.endsWith("px") ? parseInt(v.slice(0, -2), 10) : 0;

          const font = `${textareaStyles.fontSize} ${textareaStyles.fontFamily}`;
          const paddingLeft = parseValue(textareaStyles.paddingLeft);
          const paddingRight = parseValue(textareaStyles.paddingRight);

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (context) context.font = font;

          const calculateNumLines = (str: string) => {
            const textareaWidth =
              textarea.getBoundingClientRect().width -
              paddingLeft -
              paddingRight;
            const words = str.split(" ");
            let lineCount = 0;
            let currentLine = "";
            if (context) {
              for (let i = 0; i < words.length; i++) {
                const wordWidth = context.measureText(words[i] + " ").width;
                const lineWidth = context.measureText(currentLine).width;

                if (lineWidth + wordWidth > textareaWidth) {
                  lineCount++;
                  currentLine = words[i] + " ";
                } else {
                  currentLine += words[i] + " ";
                }
              }
            }

            if (currentLine.trim() !== "") {
              lineCount++;
            }

            return lineCount;
          };

          const calculateLineNumbers = () => {
            const lines = textarea.value.split("\n");
            const numLines = lines.map((line) => calculateNumLines(line));

            const lineNumbers = [];
            let i = 1;
            while (numLines.length > 0) {
              const numLinesOfSentence = numLines.shift();
              lineNumbers.push(i);
              if (numLinesOfSentence && numLinesOfSentence > 1) {
                Array(numLinesOfSentence - 1)
                  .fill("")
                  // eslint-disable-next-line @typescript-eslint/no-unused-vars
                  .forEach((_) => lineNumbers.push(""));
              }
              i++;
            }

            return lineNumbers;
          };

          const displayLineNumbers = () => {
            const lineNumbers = calculateLineNumbers();
            lineNumbersEle.innerHTML = Array.from(
              {
                length: lineNumbers.length,
              },
              (_, i) => `<div>${lineNumbers[i] || "&nbsp;"}</div>`
            ).join("");
          };

          textarea.addEventListener("input", () => {
            displayLineNumbers();
          });

          displayLineNumbers();

          const ro = new ResizeObserver(() => {
            const rect = textarea.getBoundingClientRect();
            lineNumbersEle.style.height = `${rect.height}px`;
            displayLineNumbers();
          });
          ro.observe(textarea);

          textarea.addEventListener("scroll", () => {
            lineNumbersEle.scrollTop = textarea.scrollTop;
          });
        }
      });
    });

    return (
      <div
        className={classnames(
          "code-input__wrapper",
          ...componentClasses(
            "code-input__wrapper",
            csVariant,
            csSize,
            csModifiers
          ),
          rootClasses
        )}
      >
        <div className="code-input__body">
          <div ref={gutterRef} className="code-input__gutter" />
          <Input
            {...fProps}
            primitiveType={"textArea"}
            rootClasses={classnames(
              "code-input",
              ...componentClasses("code-input", csVariant, csSize, csModifiers)
            )}
            // ref={forwardedRef}
            ref={(node) => {
              const asd = node as HTMLTextAreaElement;
              taRef.current = asd;
              if (typeof fRef === "function") {
                fRef(asd);
              } else if (fRef) {
                fRef.current = asd;
              }
            }}
            onKeyDown={onEnter}
          >
            {children}
          </Input>
        </div>
        {validationBarProps ? <ValidationBar {...validationBarProps} /> : null}
      </div>
    );
  }
);

CodeInput.displayName = "CodeInput";

function ValidationBar(props: {
  status: "waiting" | "processing" | "success" | "failure";
  message?: string;
}): JSX.Element {
  if (props.status === "waiting") {
    return (
      <div className={validationBarStyles.statusBar}>
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faPenToSquare} />
        </NewIcon>
        {props.message ? props.message : "Waiting for input"}
      </div>
    );
  } else if (props.status === "processing") {
    return (
      <div className={validationBarStyles.statusBar}>
        <NewIcon csMode="inline" rootClasses={validationBarStyles.spinningIcon}>
          <FontAwesomeIcon icon={faArrowsRotate} />
        </NewIcon>
        {props.message ? props.message : "Processing..."}
      </div>
    );
  } else if (props.status === "success") {
    return (
      <div
        className={classnames(
          validationBarStyles.statusBar,
          validationBarStyles.statusBarSuccess
        )}
      >
        <NewIcon csMode="inline" noWrapper>
          <FontAwesomeIcon icon={faCircleCheck} />
        </NewIcon>
        {props.message ? props.message : "All systems go!"}
      </div>
    );
  } else {
    return (
      <div
        className={classnames(
          validationBarStyles.statusBar,
          validationBarStyles.statusBarFailure
        )}
      >
        <NewIcon
          csMode="inline"
          noWrapper
          rootClasses={validationBarStyles.iconFailure}
        >
          <FontAwesomeIcon icon={faTriangleExclamation} />
        </NewIcon>
        {props.message
          ? props.message
          : "Problem, alarm, danger. Everything is going to explode."}
      </div>
    );
  }
}

ValidationBar.displayName = "ValidationBar";
