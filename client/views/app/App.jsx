import './app.scss';
import React, { Component } from 'react';
import Routes from './Routes.jsx';
class App extends Component {
  componentDidMount() {
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
