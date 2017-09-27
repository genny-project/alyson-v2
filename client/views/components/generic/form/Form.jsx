import './form.scss';
import React, { Component } from 'react';
import { Input } from '../';
import { string, array, } from 'prop-types';

class Form extends Component {

  static defaultProps = {
    questions: [],
  }

  static propTypes = {
    questions: array,
  }

  render() {
 	const { questions } = this.props;
    return (
      <div className="form">
      	<form>
	        {
            questions.map(question => {
              return  <Input key={question.name} {...question}/>;
            })
	        }
	    </form>
      </div>
    );
  }
}

export default Form;
