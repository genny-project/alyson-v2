import './gennyForm.scss';
import React, { Component } from 'react';
import { Form, Input } from '../../';
import { object, array } from 'prop-types';
import { GennyBridge } from 'utils/genny';

class GennyForm extends Component {

  state = {
  }

  static propTypes = {

  };

  onInputValidation = (newValue, ask_code) =>  {

    let ask = this.props.asks[ask_code];
    this.sendAnswer(newValue, ask);
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
  };

  sendData(data, items) {
    console.log('send', items);
    GennyBridge.sendAnswer(data, items);
  }

  render() {

    const { asks, style } = this.props;
    const componentStyle = { ...style, };

    return (
      <div className="genny-form">
        <Form {...this.props}>
          {
            Object.keys(asks).map((ask_code, index) => {

              let ask = asks[ask_code];
              let inputType = ask.question.type || "java.lang.String";
              return <Input 
                key={index}
                identifier={ask_code}
                type={inputType}
                style={componentStyle}
                name={ask.name}
                placeholder={ask.placeholder}
                readOnly={ask.readOnly}
                optional={ask.optional}
                validationList={ask.question.validationList}
                mask={ask.question.mask}
                onValidation={this.onInputValidation}
              />;
            })
          }
        </Form>
      </div>
    );
  }
}

export default GennyForm;
