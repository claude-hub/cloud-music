import { combineReducers } from 'redux-immutable';
import { reducer as playerReducer } from '../Player/store';

export default combineReducers({
  player: playerReducer,
});
