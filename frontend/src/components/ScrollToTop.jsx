import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    // Disable browser's default scroll restoration to prevent conflicts
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Force immediate scroll to top before paint
    window.scrollTo(0, 0);

    // Double check after a tiny delay to catch any layout shifts
    const timer = setTimeout(() => {
        window.scrollTo(0, 0);
    }, 0);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
