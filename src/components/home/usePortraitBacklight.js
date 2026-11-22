import { useEffect } from 'react';

const pointerMotion = '(any-hover: hover) and (any-pointer: fine) and (prefers-reduced-motion: no-preference)';

export default function usePortraitBacklight(hero, portrait, enabled) {
  useEffect(() => {
    if (!enabled) return;

    const section = hero.current;
    const stage = portrait.current;
    const motion = window.matchMedia(pointerMotion);
    let pointer = null;
    let frame = 0;
    let angle = Number.parseFloat(stage.style.getPropertyValue('--portrait-light-angle')) || 0;

    function settleLight() {
      pointer = null;
      window.cancelAnimationFrame(frame);
      frame = 0;
      stage.style.removeProperty('--portrait-light-radius');
    }

    function positionLight() {
      frame = 0;
      const bounds = section.getBoundingClientRect();
      if (pointer.x < bounds.left || pointer.x > bounds.right ||
          pointer.y < bounds.top || pointer.y > bounds.bottom) {
        settleLight();
        return;
      }

      const box = stage.getBoundingClientRect();
      const x = box.left + box.width / 2 - pointer.x;
      const y = box.top + box.height / 2 - pointer.y;
      if (Math.hypot(x, y) < 8) return;

      const change = Math.atan2(y, x) - angle;
      // Take the shorter rotation when the angle crosses ±π.
      angle += Math.atan2(Math.sin(change), Math.cos(change));
      stage.style.setProperty('--portrait-light-angle', `${angle}rad`);
      stage.style.setProperty('--portrait-light-radius', `${Math.min(68, box.width * 0.12)}px`);
    }

    function scheduleLight() {
      if (pointer && !frame) frame = window.requestAnimationFrame(positionLight);
    }

    function trackPointer(event) {
      if (event.pointerType !== 'mouse' || !motion.matches) return;
      pointer = { x: event.clientX, y: event.clientY };
      scheduleLight();
    }

    section.addEventListener('pointermove', trackPointer, { passive: true });
    section.addEventListener('pointerleave', settleLight);
    section.addEventListener('pointercancel', settleLight);
    window.addEventListener('scroll', scheduleLight, { passive: true });
    window.addEventListener('resize', scheduleLight);
    window.addEventListener('blur', settleLight);
    motion.addEventListener('change', settleLight);

    return () => {
      settleLight();
      section.removeEventListener('pointermove', trackPointer);
      section.removeEventListener('pointerleave', settleLight);
      section.removeEventListener('pointercancel', settleLight);
      window.removeEventListener('scroll', scheduleLight);
      window.removeEventListener('resize', scheduleLight);
      window.removeEventListener('blur', settleLight);
      motion.removeEventListener('change', settleLight);
    };
  }, [hero, portrait, enabled]);
}
