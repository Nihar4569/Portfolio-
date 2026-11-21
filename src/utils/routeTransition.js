export const routeMotion = {
  leaving: { ms: 190, event: 'covered' },
  loading: { ms: 240, event: 'loaderShown' },
  entering: { ms: 310, event: 'revealed' },
};

export function createRouteTransition(location) {
  return {
    screen: location,
    destination: location,
    phase: 'idle',
    revision: 0,
    ready: false,
    loaderShown: false,
  };
}

function showScreen(state, screen) {
  if (state.screen.pathname === screen.pathname) return { ...state, screen };
  return { ...state, screen, revision: state.revision + 1, ready: false };
}

function finishLoading(state) {
  if (state.phase === 'loading' && state.ready && state.loaderShown) {
    return { ...state, phase: 'entering' };
  }
  return state;
}

export function updateRouteTransition(state, action) {
  switch (action.type) {
    case 'navigate': {
      const destination = action.location;
      if (!action.animate) {
        return showScreen({ ...state, destination, phase: 'idle' }, destination);
      }
      if (state.screen.pathname === destination.pathname) {
        const phase = state.phase === 'leaving' ? 'entering' : state.phase;
        return { ...state, screen: destination, destination, phase };
      }
      if (state.phase === 'loading') return showScreen({ ...state, destination }, destination);
      return { ...state, destination, phase: 'leaving' };
    }
    case 'covered':
      if (state.phase !== 'leaving') return state;
      return showScreen({ ...state, phase: 'loading', loaderShown: false }, state.destination);
    case 'mounted':
      return action.revision === state.revision ? finishLoading({ ...state, ready: true }) : state;
    case 'loaderShown':
      return state.phase === 'loading' ? finishLoading({ ...state, loaderShown: true }) : state;
    case 'revealed':
      return state.phase === 'entering' ? { ...state, phase: 'idle' } : state;
    default:
      return state;
  }
}
