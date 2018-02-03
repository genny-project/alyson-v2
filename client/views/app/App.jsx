import './app.scss';
import config from 'config/config';
import React, { Component } from 'react';
import Routes from './Routes.jsx';
import { func, object } from 'prop-types';
import { Keycloak, KeycloakLogin, KeycloakLogout, KeycloakLoggedIn, KeycloakAccount } from '@genny-project/keycloak-react';
import keycloakAdapter from 'keycloak-js';
import { GennyBridge } from 'utils/genny';

class App extends Component {
  static propTypes = {
    appStart: func,
    authLoggedIn: func,
    keycloak: object,
    gps: object,
  };

  static defaultProps = {
      gps: {}
  }

  state = {
    gpsWatcher: null,
    lastPosition: null,
  }

  componentDidMount() {

    // document.ontouchmove = function(event) {
    //   event.preventDefault();
    //   event.stopPropagation();
    // };

    if (config.backendEnabled) {

      /* Start the app */
      this.props.appStart();

      document.removeEventListener('native-message', null);
      document.addEventListener('native-message', (message) => {

          if(message.detail) {

              let event = message.detail;
              switch (event.id) {

                  case "GEOFENCE":
                  GennyBridge.sendGeofenceData(event.data.value, event.data);
                  break;

                  case "GPS_UPDATE":
                  GennyBridge.sendGPSData(event.data);
                  break;

                  default: console.log("received unknown event [" + event.id + "]");
              }
          }
      });
    }
  }

  handleAuthSuccess = keycloak => {

    /* Send off the auth logged in action */
    if(keycloak.getToken()) {
        this.props.authLoggedIn({
          token: keycloak.getToken(),
          info: keycloak.getInfo(),
        });
    }
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
            <main style={{ 'height' : '100%' }}>
              <content style={{ 'height' : '100%' }}>
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
