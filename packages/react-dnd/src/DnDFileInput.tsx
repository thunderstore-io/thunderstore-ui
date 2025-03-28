import React, { ReactNode, useRef } from "react";
import { useDnDFileInput } from "./useDnDFileInput";

interface DnDFileInputProps {
  name: string;
  onChange?: (files: FileList) => void;
  readonly?: boolean;
  baseState: ReactNode;
  dragState: ReactNode;
  rootClasses: string;
}

export const DnDFileInput: React.FC<DnDFileInputProps> = (props) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { onChange, onDrop, isDragging } = useDnDFileInput({
    inputRef: fileInputRef,
    readonly: props.readonly,
    onChange: props.onChange,
  });

  const state =
    isDragging && !props.readonly ? props.dragState : props.baseState;

  return (
    <label
      // style={state.style}
      className={props.rootClasses}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      aria-disabled={props.readonly}
    >
      {state}
      <input
        type="file"
        name={props.name}
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={onChange}
        disabled={props.readonly}
      />
    </label>
  );
};
