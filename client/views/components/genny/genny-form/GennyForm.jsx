import './gennyForm.scss';
import React, { Component } from 'react';
import { Form, Input } from '../../';
import { object, array } from 'prop-types';
import { GennyBridge } from 'utils/genny';
import { AskQuery } from 'utils/genny';

class GennyForm extends Component {

  state = {
      asks: []
  }

  static propTypes = {

  };

  onInputValidation = (newValue, ask_code) =>  {

    let ask = this.state.asks[ask_code];
    this.sendAnswer(newValue, ask);
  }

  onClick = (clickedButton) => {

    if(clickedButton && clickedButton.props) {

        let data = clickedButton.props.data;
        let buttonCode = clickedButton.props.buttonCode;

        let btnEventData = {
            code: buttonCode,
            ...data
        }

        GennyBridge.sendBtnClick(btnEventData);
    }
  }

  sendAnswer = (value, ask) => {

    this.sendData([
      {
        sourceCode: ask.sourceCode,
        targetCode: ask.targetCode,
        attributeCode: ask.question.attributeCode,
        value: value,
        askId: ask.id
      }
    ]);
  };

  sendData(items) {
    GennyBridge.sendAnswer(items);
  }

  render() {

    const { root, style, className } = this.props;
    const componentStyle = { ...style, };

    let asks = AskQuery.getAsksFromGroup(root);
    // console.log("============");
    // console.log(asks);

    return (
      <div className={`genny-form ${className}`}>
        <Form {...this.props}>
          {
            asks ?
            Object.keys(asks).map((ask_code, index) => {

              let ask = asks[ask_code];
              let inputType = ask.question.type || "java.lang.String";

              let default_value = null;
              let be_code = ask.targetCode;
              let attributeCode = ask.attributeCode;
              // if(be_code && attributeCode) {
              //     let att = BaseEntityQuery.getBaseEntityAttribute(be_code, attributeCode);
              //     if(att) {
              //         default_value = att.value;
              //     }
              // }

              return <Input
                isHorizontal={this.props.isHorizontal}
                key={index}
                identifier={ask_code}
                data={{
                    value: ask.id
                }}
                type={inputType}
                style={componentStyle}
                name={ask.question.name}
                placeholder={default_value}
                readOnly={ask.readOnly}
                optional={ask.optional}
                validationList={ask.question.validationList}
                mask={ask.question.mask}
                onValidation={this.onInputValidation}
                onClick={this.onClick}
              />;
          }) : null
          }
        </Form>
      </div>
    );
  }
}

export default GennyForm;
