import './home.scss';
import React, { Component } from 'react';
// import { TestComponent } from '../components/generic';
// import { DisplayValue } from '../components/generic';
import { LayoutLoader } from 'utils/genny/layout-loader';
class Home extends Component {
  componentDidMount() {

    // document.getElementById('mounting-preview').remove();
  }
  render() {
    return (
      <div className="home">
        < LayoutLoader />
      </div >
    );
  }
}



export default Home;
