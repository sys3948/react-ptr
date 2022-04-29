import { useCallback, useState, UIEvent, Dispatch, SetStateAction, ChangeEvent } from 'react';

// const useInput = (initialData:any) => {
const useInput = <T>(initialData : T) : [T, (e : ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e:ChangeEvent<HTMLInputElement>) => {
    setValue((e.target.value as unknown) as T);
  }, []);

  return [value, handler, setValue];
};

export default useInput;