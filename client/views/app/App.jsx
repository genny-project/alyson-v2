import './app.scss';
import config from 'config/config';
import React, { Component } from 'react';
import Routes from './Routes.jsx';
import { func, object } from 'prop-types';
import { Keycloak, KeycloakLogin, KeycloakLogout, KeycloakLoggedIn, KeycloakAccount } from '@genny-project/keycloak-react';
import keycloakAdapter from 'keycloak-js';

class App extends Component {
  static propTypes = {
    appStart: func,
    authLoggedIn: func,
    keycloak: object,
  };

  componentDidMount() {
    if (config.backendEnabled) {
      /* Start the app */
      this.props.appStart();
    }
  }

  handleAuthSuccess = keycloak => {
    /* Hide the loading spinner */
    document.getElementById('mounting-preview').remove();

    /* Send off the auth logged in action */
    this.props.authLoggedIn({
      token: keycloak.getToken(),
      info: keycloak.getInfo(),
    });
  }

  render() {
    const keycloak = this.props.keycloak;
    const keycloakConfig = keycloak.config;

    /* If the backend isn't enabled just render the app */
    if (!config.backendEnabled) {
      return (
        <div className='app'>
          <main>
            <content>
              <Routes />
            </content>
          </main>
        </div>
      );
    }

    /* Render nothing if we haven't yet received the keycloak config */
    if (!keycloakConfig) {
      return (
        <div className='app' />
      );
    }

    return (
      <Keycloak config={keycloakConfig} adapter={keycloakAdapter} defaultRedirectUri={window.location.origin} onAuthSuccess={this.handleAuthSuccess}>
        <div className='app'>
          {keycloak.logout && <KeycloakLogout />}
          {keycloak.accounts && <KeycloakAccount force />}
          <KeycloakLoggedIn>
            <main>
              <content>
                <Routes />
              </content>
            </main>
          </KeycloakLoggedIn>
        </div>
        <KeycloakLogin />
      </Keycloak>
    );
  }
}

export default App;
