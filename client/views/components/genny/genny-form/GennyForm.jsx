import './gennyForm.scss';
import React, { Component } from 'react';
import { Form } from '../../';
import { object, array } from 'prop-types';
import store from 'views/store';

class GennyForm extends Component {

  state = {
  }

  static propTypes = {

  };

  render() {

    console.log(this.props);
    console.log("================");
    const {  } = this.props;

    return (
      <div className="genny-form">
        <Form  {...this.props} />
      </div>
    );
  }
}

export default GennyForm;
