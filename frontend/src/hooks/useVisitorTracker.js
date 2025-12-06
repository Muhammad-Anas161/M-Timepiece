import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const useVisitorTracker = () => {
  const location = useLocation();
  const loggedRef = useRef(false);

  useEffect(() => {
    const logVisit = async () => {
      // Avoid logging multiple times for the same page load if strict mode is on
      // But we want to track page changes, so we depend on location.pathname
      
      try {
        const screenRes = `${window.screen.width}x${window.screen.height}`;
        
        await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/tracking/log`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            screen_resolution: screenRes,
            page_url: window.location.href
          }),
        });
      } catch (error) {
        console.error('Error logging visit:', error);
      }
    };

    logVisit();
  }, [location.pathname]);
};

export default useVisitorTracker;
