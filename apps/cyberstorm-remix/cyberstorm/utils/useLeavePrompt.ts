import { useCallback, useEffect } from "react";
import { useBeforeUnload, useBlocker } from "react-router";

export function useLeavePrompt(when: boolean, message: string) {
  const blocker = useBlocker(when);
  useEffect(() => {
    if (blocker.state !== "blocked") return;
    if (window.confirm(message)) {
      blocker.proceed();
    } else {
      blocker.reset();
    }
  }, [blocker, message]);
  useBeforeUnload(
    useCallback(
      (event) => {
        if (!when) return;
        event.preventDefault();
        event.returnValue = "";
      },
      [when]
    )
  );
}
