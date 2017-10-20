import './inputText.scss';
import React, { Component } from 'react';
import { string, bool, array, object } from 'prop-types';
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

  //TODO: valueString is not necessary what we are looking for. it could be valueDate etc....

  state = {
    value: this.props.ask.answerList.answerList[0].value,
    mask: this.props.mask,
    validationList: this.props.ask.question.validationList,
    validationStatus: null,
    isValid: null,
    date: new Date(),
    hasChanges: false
  }

  handleChange = event => {
    if ( this.state.mask ) {
      console.log(this.state.mask);
      var mask = this.state.mask;
      console.log(mask.test(event.target.value));
      if ( mask.test(event.target.value) ) {
        this.setState({
          value: event.target.value,
          hasChanges: true
        })
     }
    } else {
      this.setState({
        value: event.target.value,
        hasChanges: true
      })
    }
  }

  handleBlur = event => {

    const { ask } = this.props;
    const valList = this.state.validationList;
    const value = event.target.value;

    console.log(valList);

    if ( valList.length > 0 ) {
      const valResult = valList.every( validation => new RegExp(validation.regex).test( value ));
      console.log(valResult)
      this.validateValue(valResult, value, ask);
    } else {
      //window.alert("No regex supplied");
      //this.sendAnswer(event.target.value, ask);
      const valResult = new RegExp(/.*/).test( value );
      console.log(valResult);
      this.validateValue(valResult, value, ask);
    }
  }

  validateValue = ( valResult, value, ask ) => {
    if ( valResult ){
      this.validationStyle(true, 'success');

      if(this.state.hasChanges) this.sendAnswer(value, ask);
      //setTimeout(function(){ this.setState({ submitStatus: 'success' }); }.bind(this), 3000);
    } else {
      this.validationStyle(false, 'error');
      //setTimeout(function(){ this.setState({ submitStatus: 'error' }); }.bind(this), 3000);
    }
  }

  validationStyle = (resultBool, resultString) => {
    this.setState({
      isValid: resultBool,
      validationStatus: resultString,
    });
  }

  sendAnswer = (value, ask) => {
    this.sendData('Answer', [
      {
        sourceCode: ask.sourceCode,
        targetCode: ask.targetCode,
        attributeCode: ask.question.attributeCode,
        value: value,
        askId: ask.id
      }
    ]);

    this.setState({
        hasChanges: false
    });
  };

  sendData(data, items) {
    console.log('send', items);
    GennyBridge.sendAnswer(data, items);
  }

  render() {

    const { className, name, readOnly, placeholder, optional} = this.props.ask;
    const { validationStatus, date } = this.state;

    //console.log(ask)

    return (
      <div className={`input-text ${className} ${validationStatus}`}>
        <div className="input-header">
          {name ? <Label text={name} /> : null }
          {optional ? <Label text="(optional)" /> : null}
          <SubmitStatusIcon status={validationStatus} />
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
