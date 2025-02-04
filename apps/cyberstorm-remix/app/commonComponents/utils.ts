import { TRISTATE, TRISTATE_STATES } from "./types";

/**
 * Toggling "off" -> "include" -> "exclude" -> "off"
 */
export const resolveTriState = (state: TRISTATE) =>
  TRISTATE_STATES[
    (TRISTATE_STATES.indexOf(state) + 1) % TRISTATE_STATES.length
  ];
