import { useEffect, useState } from 'react';

export function useDebounce(delay: number, initialValue = ''): [string, React.Dispatch<React.SetStateAction<string>>] {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timeout);
    };
  }, [value, delay]);

  return [debouncedValue, setValue];
}
