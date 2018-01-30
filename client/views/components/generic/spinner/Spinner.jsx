import './spinner.scss';
import React, { Component } from 'react';
import Loader from 'halogen/MoonLoader';

class Spinner extends Component {

  render() {

    return (
      <div className="spinner">
        <Loader color="#0288D1" {...this.props} />
        {
            this.props.text ? <p>{this.props.text}</p> : null
        }
      </div>
    );
  }
}

export default Spinner;
