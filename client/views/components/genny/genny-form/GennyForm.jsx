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

    const { ask } = this.props;
    console.log(ask);

    return (
      <div className="genny-form">
        <Form {...this.props} asks={ask.data} />
      </div>
    );
  }
}

export default GennyForm;
