const revealTarget = '[data-scroll-reveal]:not([data-scroll-revealed])';
const nativeScrollTimeline = '(animation-timeline: view()) and (animation-range: entry)';

export function observeScrollReveals(root) {
  if (CSS.supports(nativeScrollTimeline) || typeof IntersectionObserver !== 'function' ||
      !window.matchMedia('(prefers-reduced-motion: no-preference)').matches) return;

  const visibility = new IntersectionObserver((entries) => {
    for (const { target, isIntersecting } of entries) {
      if (!isIntersecting) continue;
      target.setAttribute('data-scroll-revealed', '');
      visibility.unobserve(target);
    }
  }, { rootMargin: '0px 0px -16px 0px' });

  function visit(node, handle) {
    if (node.nodeType !== 1) return;
    if (node.matches(revealTarget)) handle(node);
    node.querySelectorAll(revealTarget).forEach(handle);
  }

  const observe = (target) => visibility.observe(target);
  const unobserve = (target) => visibility.unobserve(target);
  const updates = new MutationObserver((records) => {
    for (const { addedNodes, removedNodes } of records) {
      removedNodes.forEach((node) => visit(node, unobserve));
      addedNodes.forEach((node) => visit(node, observe));
    }
  });

  visit(root, observe);
  updates.observe(root, { childList: true, subtree: true });
  return () => {
    updates.disconnect();
    visibility.disconnect();
  };
}
