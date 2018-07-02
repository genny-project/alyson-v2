import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import history from './history';
import { createEpicMiddleware } from 'redux-observable';
import gennyRouterMiddleware from 'utils/genny/router/gennyRouter.middleware';
import reducers from './reducers';
import epics from '../epics';

const epicMiddleware = createEpicMiddleware( epics );

let middleware = applyMiddleware(
  routerMiddleware( history ),
  thunk,
  epicMiddleware,
  logger()
);

if (process.env.NODE_ENV != 'production') {

    middleware = applyMiddleware(
      routerMiddleware( history ),
      thunk,
      epicMiddleware,
      logger()
    );
}

const store = createStore( reducers, middleware );

// grabbing component state from local storage
store.getState().app.componentState = JSON.parse(localStorage.getItem('componentState')) || {};

// storing method
store.storeState = (identifier, newState) => {

    // updating the store
    store.getState().app.componentState[identifier] = newState;

    // stringifying the componentstate and storing it.
    let updatedState = JSON.stringify(store.getState().app.componentState);
    localStorage.setItem('componentState', updatedState);
};

export default store;
