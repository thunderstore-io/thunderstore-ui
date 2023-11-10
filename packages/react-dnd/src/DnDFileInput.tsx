import React, { CSSProperties, useRef } from "react";
import { useDnDFileInput } from "./useDnDFileInput";

interface DnDFileInputProps {
  name: string;
  onChange?: (files: FileList) => void;
  readonly?: boolean;
  baseState: {
    title: string;
    style?: CSSProperties;
    className?: string;
  };
  dragState: {
    title: string;
    style?: CSSProperties;
    className?: string;
  };
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
      style={state.style}
      className={state.className}
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDrop}
      aria-disabled={props.readonly}
    >
      {state.title}
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
