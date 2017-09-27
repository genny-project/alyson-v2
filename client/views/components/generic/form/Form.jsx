import './form.scss';
import React from 'react';
import { GennyComponent } from '../genny-component';
import { Input } from '../';
import { string, array, } from 'prop-types';

class Form extends GennyComponent {

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
