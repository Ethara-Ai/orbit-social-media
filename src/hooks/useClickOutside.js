import { useEffect, useRef } from 'react';

/**
 * Hook that handles click outside of the passed ref element
 * Useful for closing dropdowns, modals, and popovers
 *
 * @param {Function} handler - Callback function to execute when clicking outside
 * @param {boolean} enabled - Whether the hook is active (default: true)
 * @returns {React.RefObject} - Ref to attach to the element
 *
 * @example
 * const dropdownRef = useClickOutside(() => setIsOpen(false));
 * return <div ref={dropdownRef}>Dropdown content</div>
 */
function useClickOutside(handler, enabled = true) {
  const ref = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event) => {
      // Check if click is outside the referenced element
      if (ref.current && !ref.current.contains(event.target)) {
        handler(event);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        handler(event);
      }
    };

    // Add event listeners
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    // Cleanup
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handler, enabled]);

  return ref;
}

export default useClickOutside;
