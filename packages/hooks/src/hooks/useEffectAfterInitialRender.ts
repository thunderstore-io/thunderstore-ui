import { EffectCallback, useEffect, useRef } from "react";

/**
 * Like React's useEffect, except doesn't execute on initial render.
 */
export const useEffectAfterInitialRender: typeof useEffect = (
  effect,
  deps?
) => {
  const didMount = useRef(false);

  useEffect(() => {
    let cleanup: ReturnType<EffectCallback> = undefined;

    if (didMount.current) {
      cleanup = effect();
    } else {
      didMount.current = true;
    }

    return cleanup;
  }, deps);
};
