import 'rxjs';
import { combineEpics } from 'redux-observable';
import appStart from './appStart';

export default combineEpics(
  appStart
);
