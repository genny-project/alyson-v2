import './home.scss';
import React, { Component } from 'react';
// import { TestComponent } from '../components/generic';
import { DisplayValue } from '../components/generic';
import { LayoutLoader } from 'utils/genny/layout-loader';
class Home extends Component {
  componentDidMount() {

  }
  render() {
    console.log('Log Displayvalue component', DisplayValue);
    return (
      <div className="home">
        < LayoutLoader />
      </div >
    );
  }
}


export default Home;
