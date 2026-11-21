import { useLayoutEffect } from 'react';

// This component automatically scrolls to the top when the route changes
const ScrollToTop = ({ pathname }) => {
  
  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  
  return null;
};

export default ScrollToTop;
