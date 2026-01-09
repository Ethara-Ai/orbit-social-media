import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Custom hook for persistent state using localStorage
 * @param {string} key - The localStorage key
 * @param {any} initialValue - The initial value if no stored value exists
 * @returns {[any, function, function]} - [storedValue, setValue, removeValue]
 */
function useLocalStorage(key, initialValue) {
  // Get initial value from localStorage or use provided initial value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Use ref to track the latest stored value for functional updates
  // This prevents stale closure issues when setValue is called multiple times
  const storedValueRef = useRef(storedValue);

  // Keep ref in sync with state
  useEffect(() => {
    storedValueRef.current = storedValue;
  }, [storedValue]);

  // Update localStorage when state changes
  const setValue = useCallback(
    (value) => {
      try {
        // Allow value to be a function for same API as useState
        // Use ref to get the current value to avoid stale closures
        const valueToStore = value instanceof Function ? value(storedValueRef.current) : value;

        // Update state
        setStoredValue(valueToStore);

        // Update ref immediately for subsequent calls
        storedValueRef.current = valueToStore;

        // Persist to localStorage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      storedValueRef.current = initialValue;

      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === key && event.newValue !== null) {
        try {
          const newValue = JSON.parse(event.newValue);
          setStoredValue(newValue);
          storedValueRef.current = newValue;
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error);
        }
      } else if (event.key === key && event.newValue === null) {
        setStoredValue(initialValue);
        storedValueRef.current = initialValue;
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

export default useLocalStorage;
