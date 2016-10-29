import {
  createStore,
  applyMiddleware,
  combineReducers,
  compose,
} from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import {
  responsiveStateReducer,
  responsiveStoreEnhancer,
} from 'redux-responsive';
import {
  routerReducer as routing,
  routerMiddleware,
} from 'react-router-redux';
import { browserHistory } from 'react-router';
import app from 'reducers';

const loggerMiddleware = createLogger();

const reducer = combineReducers({
  app,
  routing,
  browser: responsiveStateReducer,
});
/* eslint-disable no-underscore-dangle */
// This enables the redux dev tools extension, or does nothing if not installed
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
/* eslint-enable */

export default createStore(reducer, composeEnhancers(
  responsiveStoreEnhancer,
  applyMiddleware(thunkMiddleware),
  applyMiddleware(loggerMiddleware),
  applyMiddleware(routerMiddleware(browserHistory)),
));
