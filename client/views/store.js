import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router-dom';
import { createEpicMiddleware } from 'redux-observable';
import reducers from './reducers';
import epics from '../epics';

const epicMiddleware = createEpicMiddleware( epics );

const middleware = applyMiddleware(
  routerMiddleware( browserHistory ),
  thunk,
  epicMiddleware,
  logger()
);
const store = createStore( reducers, middleware );


export default store;
