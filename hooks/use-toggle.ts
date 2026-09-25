import { useState, useCallback, Dispatch, SetStateAction } from "react";

export type UseToggleReturn = [
  boolean,
  () => void,
  () => void,
  () => void,
  setValue: Dispatch<SetStateAction<boolean>>,
];

function useToggle(defaultValue: boolean = false): UseToggleReturn {
  const [value, setValue] = useState<boolean>(defaultValue);

  const toggle = useCallback(() => {
    setValue((prevValue) => !prevValue);
  }, []);

  const setTrue = useCallback(() => {
    setValue(true);
  }, []);

  const setFalse = useCallback(() => {
    setValue(false);
  }, []);

  return [value, toggle, setTrue, setFalse, setValue];
}

export default useToggle;
