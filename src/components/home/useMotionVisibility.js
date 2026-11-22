import { useEffect, useState } from 'react';

export default function useMotionVisibility(target, threshold = 0, enabled = true) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let inView = typeof IntersectionObserver !== 'function';
    const update = () => setVisible(inView && !document.hidden);
    const observer = typeof IntersectionObserver === 'function'
      ? new IntersectionObserver(([entry]) => {
        inView = entry.isIntersecting && entry.intersectionRatio >= threshold;
        update();
      }, { threshold })
      : null;

    observer?.observe(target.current);
    document.addEventListener('visibilitychange', update);
    update();

    return () => {
      observer?.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, [target, threshold, enabled]);

  return enabled && visible;
}
