import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { API_URL } from '../services/api';

const useVisitorTracker = () => {
  const location = useLocation();
  const loggedRef = useRef(false);

  useEffect(() => {
    const logVisit = async () => {
      // Avoid logging multiple times for the same page load if strict mode is on
      // But we want to track page changes, so we depend on location.pathname
      
      try {
        const screenRes = `${window.screen.width}x${window.screen.height}`;
        
        await fetch(`${API_URL}/tracking/log`, {
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
