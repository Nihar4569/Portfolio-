import React, { Component, createContext, Suspense, useEffect, useLayoutEffect, useReducer, useRef, useSyncExternalStore } from 'react';
import { useLocation } from 'react-router-dom';
import { FiCode } from 'react-icons/fi';
import { useSound } from '../../context/SoundContext';
import { createRouteTransition, routeMotion, updateRouteTransition } from '../../utils/routeTransition';
import ScrollToTop from './ScrollToTop';
import './page-transition.css';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';
const motionTiming = {
  '--route-exit-time': `${routeMotion.leaving.ms}ms`,
  '--route-enter-time': `${routeMotion.entering.ms}ms`,
};
const loaderText = new Map([
  ['/', 'Loading home…'],
  ['/projects', 'Loading projects…'],
  ['/albums', 'Accessing photo gallery…'],
  ['/contact', 'Opening communication channel…'],
]);

export const PageTransitionContext = createContext(false);

function reducedMotion() {
  return window.matchMedia(reducedMotionQuery).matches;
}

function watchReducedMotion(change) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener('change', change);
  return () => media.removeEventListener('change', change);
}

function CodeLoader({ pathname, pending = false }) {
  const path = pathname.replace(/\/$/, '') || '/';
  const text = loaderText.get(path) ?? 'Opening page…';
  return (
    <div className="route-code-loader" role={pending ? 'status' : undefined}>
      <FiCode className="route-code-icon" aria-hidden="true" />
      <p key={text}><span>{text}</span></p>
    </div>
  );
}

function PageMounted({ revision, dispatch }) {
  useLayoutEffect(() => {
    dispatch({ type: 'mounted', revision });
  }, [dispatch, revision]);
  return null;
}

class RouteLoadBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

export default function PageTransition({ children }) {
  const location = useLocation();
  const skipMotion = useSyncExternalStore(watchReducedMotion, reducedMotion);
  const { playSound } = useSound();
  const [state, dispatch] = useReducer(updateRouteTransition, location, createRouteTransition);
  const lastPath = useRef(location.pathname);
  const focusedRevision = useRef(0);
  const stage = useRef(null);
  const { screen, destination, phase, revision, ready } = state;
  const moving = phase !== 'idle';

  useLayoutEffect(() => {
    dispatch({ type: 'navigate', location, animate: !skipMotion });
    if (lastPath.current !== location.pathname) {
      lastPath.current = location.pathname;
      playSound('navigation');
    }
  }, [location, skipMotion, playSound]);

  useEffect(() => {
    const timing = routeMotion[phase];
    if (!timing) return;
    const delay = phase === 'loading' ? timing.ms : timing.ms + 50;
    const timeout = setTimeout(() => dispatch({ type: timing.event }), delay);
    return () => clearTimeout(timeout);
  }, [phase]);

  useLayoutEffect(() => {
    if (moving || !ready || focusedRevision.current === revision) return;
    focusedRevision.current = revision;
    if (document.querySelector('dialog[open]')) return;
    const heading = stage.current.querySelector('h1');
    heading?.setAttribute('tabindex', '-1');
    heading?.focus({ preventScroll: true });
  }, [moving, ready, revision]);

  function finishCurtain(event) {
    if (event.target !== event.currentTarget || event.propertyName !== 'opacity') return;
    if (phase === 'leaving' || phase === 'entering') dispatch({ type: routeMotion[phase].event });
  }

  const failure = (
    <div className="route-pending">
      <div className="route-load-error">
        <h1>Page unavailable</h1>
        <button type="button" onClick={() => window.location.reload()}>Reload page</button>
      </div>
      <PageMounted revision={revision} dispatch={dispatch} />
    </div>
  );

  return (
    <div className="route-transition" data-route-phase={phase} style={motionTiming}>
      <ScrollToTop pathname={screen.pathname} />
      <PageTransitionContext.Provider value={moving}>
        <div className="route-stage" ref={stage} inert={moving ? '' : undefined}>
          <RouteLoadBoundary key={revision} fallback={failure}>
            <Suspense fallback={<div className="route-pending"><CodeLoader pathname={screen.pathname} pending /></div>}>
              {children(screen)}
              <PageMounted revision={revision} dispatch={dispatch} />
            </Suspense>
          </RouteLoadBoundary>
        </div>
      </PageTransitionContext.Provider>
      <div className="route-curtain" aria-hidden="true" onTransitionEnd={finishCurtain}>
        <CodeLoader pathname={destination.pathname} />
      </div>
    </div>
  );
}
