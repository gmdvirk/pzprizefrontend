import { useEffect } from 'react';

const ScrollLock = () => {
  useEffect(() => {
    // Store original body style
    const originalStyle = window.getComputedStyle(document.body).overflow;
    
    // Prevent scroll on body
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.top = '0';
    document.body.style.left = '0';

    // Prevent touch scrolling
    const preventDefault = (e) => {
      e.preventDefault();
    };

    // Prevent scrolling when touching these elements
    const scrollEvents = [
      'touchmove',
      'mousewheel',
      'DOMMouseScroll',
      'wheel'
    ];

    // Add all event listeners
    scrollEvents.forEach((event) => {
      document.addEventListener(event, preventDefault, { passive: false });
    });

    // Handle keyboard scroll prevention
    const preventKeyScroll = (e) => {
      // Prevent arrow keys, spacebar, page up/down, home, end
      if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', preventKeyScroll);

    // Additional touch event handling for iOS
    document.addEventListener('gesturestart', preventDefault);
    document.addEventListener('gesturechange', preventDefault);
    document.addEventListener('gestureend', preventDefault);

    // Cleanup function
    return () => {
      // Remove all event listeners
      scrollEvents.forEach((event) => {
        document.removeEventListener(event, preventDefault);
      });
      document.removeEventListener('keydown', preventKeyScroll);
      document.removeEventListener('gesturestart', preventDefault);
      document.removeEventListener('gesturechange', preventDefault);
      document.removeEventListener('gestureend', preventDefault);

      // Restore original body style
      document.body.style.overflow = originalStyle;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.height = '';
      document.body.style.top = '';
      document.body.style.left = '';
    };
  }, []);

  return null;
};

export default ScrollLock;