import './app.scss';
import React, { Component } from 'react';
import Routes from './Routes.jsx';
import { func } from 'prop-types';

class App extends Component {
  static propTypes = {
    appStart: func,
  };

  componentDidMount() {
    /* Start the app */
    this.props.appStart();

    /* Hide the loading spinner */
    document.getElementById( 'mounting-preview' ).remove();
  }

  render() {
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
}

export default App;
