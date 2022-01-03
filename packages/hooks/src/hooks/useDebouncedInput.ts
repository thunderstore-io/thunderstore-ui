import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from "react";
import { debounce } from "ts-debounce";

export interface DebouncedEventHandler {
  (event: ChangeEvent<HTMLInputElement>): Promise<void>;
  cancel: (reason?: string) => void;
}

interface DebouncedInput {
  (
    /** Value the state is initialized with */
    initialValue: string,
    /** Debounce duration in milliseconds */
    wait?: number
  ): [
    /** The value stored in the state */
    string,
    /** Debounced event handler to be used with input's onChange */
    DebouncedEventHandler,
    /** State setter for setting the value immediately */
    Dispatch<SetStateAction<string>>
  ];
}

/**
 * Wrapper for storing and updating a value of text input in state.
 *
 * This hook can be used quite like useState, when the value is bound to
 * a text input. Updating the value is debounced so each keypress
 * doesn't trigger a rerender.
 *
 * // Initialize state.
 * const [value, setValueDebounced, setValueNow] = useDebouncedInput("");
 *
 * // Cleanup to avoid updating unmounted component.
 * useEffect(() => {
 *   return () => setQueryDebounced.cancel();
 * }, []);
 *
 * // Rendering.
 * <input type="text" defaultValue={value} onChange={setValueDebounced} />
 */
export const useDebouncedInput: DebouncedInput = (initialValue, wait = 300) => {
  const [value, setValue] = useState(initialValue);

  const immediateOnInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const debouncedOnInputChange = useMemo(
    () => debounce(immediateOnInputChange, wait),
    [debounce, immediateOnInputChange, wait]
  );

  return [value, debouncedOnInputChange, setValue];
};
