import './home.scss';
import React, { Component } from 'react';
import { LayoutLoader } from 'utils/genny/layout-loader';

class Home extends Component {
  render() {
    return (
      <div className="home">
        <LayoutLoader />
      </div>
    );
  }
}

export default Home;
