/* Third Party */
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router'

/* First Party */
import promptCanvas from './prompt-canvas';


export default (history) => combineReducers({
  router: connectRouter(history),
  promptCanvas
});