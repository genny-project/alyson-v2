import './app.scss';
import React, { Component } from 'react';
import Routes from './Routes.jsx';
import { func, object } from 'prop-types';
import { Keycloak, KeycloakLogin } from '@genny-project/keycloak-react';
import keycloakAdapter from 'keycloak-js';

class App extends Component {
  static propTypes = {
    appStart: func,
    keycloak: object,
  };

  componentDidMount() {
    /* Start the app */
    this.props.appStart();

    /* Hide the loading spinner */
    document.getElementById( 'mounting-preview' ).remove();
  }

  render() {
    const { config } = this.props.keycloak;

    /* Render nothing if we haven't yet received the keycloak config */
    if ( !config ) {
      return (
        <div className='app' />
      );
    }

    return (
      <Keycloak config={config} adapter={keycloakAdapter} defaultRedirectUri={'http://localhost:4000/'}>
        <div className='app'>
          <main>
            <content>
              <Routes />
            </content>
          </main>
        </div>
        <KeycloakLogin />
      </Keycloak>
    );
  }
}

export default App;
