/* Third Party */
import { 
  createStore, 
  applyMiddleware, 
  compose, 
  combineReducers 
} from 'redux';
import { 
  connectRouter, 
  routerMiddleware 
} from 'connected-react-router'
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { createBrowserHistory } from 'history';

/* First Party */
import promptCanvas from './modules/prompt-canvas';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  promptCanvas
});

export const history = createBrowserHistory();

const initialState = {};
const enhancers = [];
const middleware = [
  thunk, 
  routerMiddleware(history) // for dispatching history actions
];

if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;
  middleware.unshift(createLogger('IDEO Hudson'));

  if(typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
}

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

export default function configureStore(preloadedState) {
  const store = createStore(
    createRootReducer(history), // root reducer with router state
    preloadedState,
    composedEnhancers,
  );
  return store;
}

// export default createStore(
//   connectRouter(history)(rootReducer),
//   initialState,
//   composedEnhancers
// )

