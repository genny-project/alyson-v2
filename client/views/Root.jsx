import 'styles/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from 'views/store';
import { Router } from 'react-router-dom';
import { Home } from 'views';
import history from './history';
window.reactRouterHistory = history;

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Home />
    </Router>
  </Provider>,
  document.getElementById( 'root' )
);
