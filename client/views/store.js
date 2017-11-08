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

// grabbing component state from local storage
store.getState().app.componentState = JSON.parse(localStorage.getItem("componentState")) || {};

// storing method
store.storeState = (identifier, newState) => {

    // updating the store
    store.getState().app.componentState[identifier] = newState;

    // stringifying the componentstate and storing it.
    let updatedState = JSON.stringify(store.getState().app.componentState);
    localStorage.setItem("componentState", updatedState);
};

export default store;
