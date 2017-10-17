import './gennyForm.scss';
import React, { Component } from 'react';
import { Form } from '../../';
import { object, array } from 'prop-types';

class GennyForm extends Component {

  state = {
  }

  static propTypes = {
  };

  render() {
    const {  } = this.props;

    return (
      <div className="genny-form">
        <Form />
      </div>
    );
  }
}

export default GennyForm;
