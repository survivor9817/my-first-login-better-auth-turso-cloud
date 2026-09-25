import { useCallback, useEffect, useRef, useState } from "react";

export function useTimeoutFn(callback: () => void, delay: number) {
  const callbackRef = useRef(callback);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsPending(false);
  }, []);

  const set = useCallback(() => {
    clear();
    setIsPending(true);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setIsPending(false);
      callbackRef.current();
    }, delay);
  }, [delay, clear]);

  useEffect(() => clear, [clear]);

  return { set, clear, isPending };
}
