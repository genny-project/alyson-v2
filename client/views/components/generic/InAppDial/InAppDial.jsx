/* global Twilio */
import './InAppDial.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import axios from 'axios';
import ReactDOM from 'react-dom';

class InAppDial extends Component {
  static propTypes = {
    name: string,
    url: string,
    phone: string,
    fromPhone: string,
  };

  state = {
    showingDialer: false,
    error: false,
    token: null,
    setup: false,
  };

  componentDidMount = () => {
    axios.post( this.props.url + '/token' ).then( response => {
      this.setState({ token: response.data.token });
    }).catch( e => {
      console.error( e );
      this.setState({ error: true });
    });
  }

  handleDial = () => {
    this.setState({ showingDialer: true });

    if ( !this.state.setup ) {
      Twilio.Device.setup( this.state.token );
    }

    if ( Twilio.Device.status() === 'ready' ) {
      this.setState({ setup: true });

      /* Call the phone number specified */
      this.currentConnection = Twilio.Device.connect({ phone: this.props.phone, fromPhone: this.props.fromPhone });
    } else {
      Twilio.Device.ready(() => {
        this.currentConnection = Twilio.Device.connect({ phone: this.props.phone, fromPhone: this.props.fromPhone });
      });
    }
  }

  handleEndCall = () => {
    try {
      this.currentConnection.disconnect();
    } catch ( e ) {
      console.error( e );
    }
    this.setState({ showingDialer: false });
  }

  handleClose = () => {
    this.setState({ showingDialer: false });
  }

  renderDialerIfNeeded = () => {

      const { showingDialer, error } = this.state;

      ReactDOM.render(
        <div>
            { showingDialer && (
              <div className="dialer-overlay-window">
                <div className="dialer">
                  {!error ? (
                    <div>
                      <h1>Calling {name}</h1>
                      <i className="material-icons" onClick={this.handleEndCall}>call_end</i>
                    </div>
                  ) : (
                    <div>
                      <h1>An error has occured</h1>
                      <i className="material-icons" onClick={this.handleClose}>close</i>
                    </div>
                  )}
                </div>
              </div>
            )}
        </div>,
        document.getElementById('modal-root')
      );
  }
  render() {

    const { showingDialer, error } = this.state;
    const { name } = this.props;

    this.renderDialerIfNeeded();

    return (
      <div className="in-app-dial">
        <div className="button" onClick={this.handleDial}>
          <i className="material-icons">call</i> Call {name}
        </div>
      </div>
    );
  }
}

export default InAppDial;
