import 'styles/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'views/store';
import { ConnectedRouter } from 'react-router-redux';
import { Home, App } from 'views';
import 'utils/utils.js';
import history from './history';
window.reactRouterHistory = history;


ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);
