import { useCallback, useEffect, useState } from "react";

type SetValue<T> = (newValue: T | ((prevValue: T) => T)) => void;
type UseLocalStorageReturn<T> = [T, SetValue<T>];

const readValue = <T>(keyName: string, defaultValue: T): T => {
  let raw: string | null;

  try {
    raw = window.localStorage.getItem(keyName);
  } catch (err) {
    console.error(`Error reading localStorage key "${keyName}":`, err);
    return defaultValue;
  }

  if (raw === null) return defaultValue;

  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error(`Error parsing localStorage key "${keyName}":`, err);
    return defaultValue;
  }
};

export const useLocalStorage = <T>(keyName: string, defaultValue: T): UseLocalStorageReturn<T> => {
  const [storedValue, setStoredValue] = useState<T>(() => readValue(keyName, defaultValue));

  // Re-sync when the key itself changes (e.g. switching books) so the
  // hook reflects the new key's value instead of stale state from the old key.
  useEffect(() => {
    setStoredValue(readValue(keyName, defaultValue));
    // defaultValue intentionally omitted: it's expected to be stable/inline
    // and re-running on every render of a new default would defeat the point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyName]);

  // Keep in sync across tabs/windows, and across other hook instances
  // in this tab watching the same key.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.storageArea !== window.localStorage || e.key !== keyName) return;
      setStoredValue(e.newValue === null ? defaultValue : readValue(keyName, defaultValue));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [keyName, defaultValue]);

  const setValue: SetValue<T> = useCallback(
    (newValue) => {
      setStoredValue((prev) => {
        const valueToStore = newValue instanceof Function ? newValue(prev) : newValue;

        try {
          if (valueToStore === undefined || valueToStore === null) {
            window.localStorage.removeItem(keyName);
          } else {
            window.localStorage.setItem(keyName, JSON.stringify(valueToStore));
          }
        } catch (err) {
          console.error(`Error setting localStorage key "${keyName}":`, err);
        }

        return valueToStore;
      });
    },
    [keyName],
  );

  return [storedValue, setValue];
};
