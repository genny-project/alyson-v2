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
	            questions.map(q => {
	              return  <Input type={q.type} key={q.name} name={q.name} placeholder={q.placeholder} options={q.options}/>;

	            })
	        }
	    </form>
      </div>
    );
  }
}

export default Form;
