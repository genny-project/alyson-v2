import './inputText.scss';
import React, { Component } from 'react';
import { string, bool, array, object} from 'prop-types';
import { Label, SubmitStatusIcon } from '../';
import { GennyBridge } from 'utils/genny';

class InputText extends Component {
  static defaultProps = {
    ask: {},
    className: ''
  }

  static propTypes = {
    className: string,
    ask: object
  }

  state = {
    value: '',
    mask: this.props.mask,
    validationList: this.props.ask.question.validationList,
    validationClass: '',
    isValid: null,
    submitStatus: null,
    date: new Date(),
  }

  handleChange = event => {
    if ( this.state.mask ) {
      console.log(this.state.mask);
      var mask = this.state.mask;
      console.log(mask.test(event.target.value));
      if ( mask.test(event.target.value) ) {
        this.setState({
          value: event.target.value
        })
     }
    } else {
      this.setState({
        value: event.target.value
      })
    }
  }

  handleBlur = event => {

    var valList = this.state.validationList;

    console.log(valList);

    if ( valList.length > 0 ) {
      valList.forEach((element) => {

        const valItem = new RegExp(element.regex);
        if ( valItem.test(event.target.value) ){
          this.setState({
            isValid: true,
            validationClass: 'success',
            submitStatus: 'sending',
          });

          setTimeout(function(){ this.setState({ submitStatus: 'success' }); }.bind(this), 3000);

        } else {
          this.setState({
            isValid: false,
            validationClass: 'error',
            submitStatus: 'sending',
          });
          
          setTimeout(function(){ this.setState({ submitStatus: 'error' }); }.bind(this), 3000);
        }
      });
    } else if ( valList.length === 0 ) {
      this.sendData('ANSWER', {
        code: '',
        value: '',
      });
    }
  }

  sendData(event, data) {
    console.log('send', data);
    GennyBridge.sendAnswer(event, data);
  }

  render() {
    const { className, name, readOnly, placeholder, optional} = this.props.ask;
    const { validationClass, submitStatus, date } = this.state;

    return (
      <div className={`input-text ${className} ${validationClass}`}>
        <div className="input-header">
          {name ? <Label text={name} /> : null }
          {optional ? <Label text="(optional)" /> : null}
          <SubmitStatusIcon status={submitStatus} />
        </div>
        <input
          type="text"
          disabled={readOnly}
          placeholder={placeholder}
          value={this.state.value}
          onChange={this.handleChange}
          onBlur={this.handleBlur}
        />
      </div>
    );
  }
}

export default InputText;