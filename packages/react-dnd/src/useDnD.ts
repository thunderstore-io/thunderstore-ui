import { useCallback, useEffect, useState } from "react";

export const useDnD = () => {
  const [lastTarget, setLastTarget] = useState<EventTarget | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const resetDrag = useCallback(() => {
    setIsDragging(false);
  }, [setIsDragging]);

  const windowDragEnter = useCallback(
    (e: DragEvent) => {
      setIsDragging(true);
      setLastTarget(e.target);
    },
    [setIsDragging, setLastTarget]
  );

  const windowDragLeave = useCallback(
    (e: DragEvent) => {
      if (e.target === lastTarget || e.target === document) {
        resetDrag();
      }
    },
    [resetDrag]
  );

  useEffect(() => {
    window.addEventListener("dragenter", windowDragEnter);
    window.addEventListener("dragleave", windowDragLeave);
    window.addEventListener("drop", resetDrag);
    return () => {
      window.removeEventListener("dragenter", windowDragEnter);
      window.removeEventListener("dragleave", windowDragLeave);
      window.removeEventListener("drop", resetDrag);
    };
  }, [windowDragEnter, windowDragLeave, resetDrag]);

  return { isDragging, resetDrag };
};
