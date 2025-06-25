import React, { RefObject } from "react";
import { useDnD } from "./useDnD";

type useDragAndDropInputProps = {
  inputRef: RefObject<HTMLInputElement | null>;
  readonly?: boolean;
  onChange?: (files: FileList) => void;
};
export const useDnDFileInput = (props: useDragAndDropInputProps) => {
  const { isDragging, resetDrag } = useDnD();

  const onChange = () => {
    if (!props.readonly) {
      const inp = props.inputRef?.current;
      const files = inp?.files;
      if (props.onChange && files) {
        props.onChange(files);
      }
    }
    resetDrag();
  };

  const onDrop = (e: React.DragEvent) => {
    if (!props.readonly) {
      const inp = props.inputRef?.current;
      if (inp) {
        inp.files = e.dataTransfer.files;
      }
      if (props.onChange) {
        props.onChange(e.dataTransfer.files);
      }
    }
    e.preventDefault();
    resetDrag();
  };

  return { isDragging, onChange, onDrop };
};
