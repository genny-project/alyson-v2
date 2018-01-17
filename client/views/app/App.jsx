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

  state = {
    gpsWatcher: null,
    lastPosition: null,
  }

  componentDidMount() {

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
                  default: console.log("received unknown event [" + event.id + "]");
              }
          }
      })
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

  setupGoogleAPI() {

      let googleScript = document.getElementById("google-api");
      if(!googleScript) {

          // load google api
          //TODO: move the API key to config file
          const script = document.createElement("script");
          script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAq6Te7CSJZvfTITavnAijxdkqN-Viugpg&libraries=places";
          script.async = true;
          script.id = "google-api";
          document.body.appendChild(script);
      }
  }

  setupGPS() {

        setInterval(() => {

            if(this.props.gps && this.props.gps.destinations) {

                navigator.geolocation.getCurrentPosition(
                    (position) => {

                        var lastPosition = JSON.stringify(position);
                        this.setState({lastPosition});

                        if(position && position.coords) {

                            this.props.gps.destinations.forEach(destination => {

                                GeoFencing.containsLocation({
                                    x: position.coords.latitude,
                                    y: position.coords.lontitude,
                                }, destination.center, destination.radius)
                                .then(() => {

                                    if(destination.status == "out") {
                                        this.onEnterGPSCircle(destination)
                                    }
                                })
                                .catch(() => {

                                    if(destination.status == "in") {
                                        this.onExitGPSCircle(destination)
                                    }
                                    else if(destination.status == "out") {
                                        this.onEnterGPSCircle(destination)
                                    }
                                })
                            });
                        }
                    },
                    (error) => console.log(error.message),
                    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
                );
            }

        }, 5000);
  }

  onExitGPSCircle = (destination) => {

        console.log("did exit destination: ");
        console.log(destination);
        this.props.gps.destinations.filter(x => x.latitude == destination.latitude && x.longitude == destination.longitude)[0].status = "out";
        // this.sendDataToWeb("GEOFENCE", {
        //     value: "GEOFENCE_EXIT",
        //     code: destination.exitCode,
        // })
    }

    onEnterGPSCircle = (destination) => {

        console.log("did enter destination: ");
        console.log(destination);
        this.props.gps.destinations.filter(x => x.latitude == destination.latitude && x.longitude == destination.longitude)[0].status = "in";
        // this.sendDataToWeb("GEOFENCE", {
        //     value: "GEOFENCE_ENTRY",
        //     code: destination.enterCode,
        // })
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

    this.setupGoogleAPI();
    this.setupGPS();

    return (
      <Keycloak config={keycloakConfig} adapter={keycloakAdapter} defaultRedirectUri={window.location.origin} onAuthSuccess={this.handleAuthSuccess}>
        <div className='app'>
          {keycloak.logout && <KeycloakLogout />}
          {keycloak.accounts && <KeycloakAccount force />}
          <KeycloakLoggedIn>
            <main style={{ "height" : "100%" }}>
              <content style={{ "height" : "100%" }}>
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
