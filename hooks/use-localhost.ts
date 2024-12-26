import { useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue?: T) {
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    if (typeof window === "undefined") return initialValue;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage key:", key, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue as T) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error("Error setting localStorage key:", key, error);
    }
  };

  const removeValue = () => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
      setStoredValue(undefined);
    } catch (error) {
      console.error("Error removing localStorage key:", key, error);
    }
  };

  return { storedValue, setValue, removeValue };
}