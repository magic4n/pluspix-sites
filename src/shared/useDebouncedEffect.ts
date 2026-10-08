import { useEffect, useRef } from 'react';

/**
 * Executes an effect with a debounce delay whenever its dependencies change.
 * @param effect The effect callback.
 * @param delay Delay in milliseconds.
 * @param deps Dependency list.
 */
export function useDebouncedEffect(
  effect: () => void | (() => void),
  delay: number,
  deps: React.DependencyList
): void {
  const cleanupRef = useRef<(() => void) | void>();

  useEffect(() => {
    const handler = setTimeout(() => {
      cleanupRef.current = effect();
    }, delay);

    return () => {
      clearTimeout(handler);
      if (typeof cleanupRef.current === 'function') {
        cleanupRef.current();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
