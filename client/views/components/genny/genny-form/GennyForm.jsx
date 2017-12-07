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
        };

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

  renderForm(title, asks) {

      if(asks) {

          return {
              title: title,
              content: asks.map((ask, index) => {

                  if(ask.childAsks) return this.renderForm(ask.name, ask.childAsks);
                  let inputType = ask.question.type || 'java.lang.String';

                  let default_value = null;
                  let be_code = ask.targetCode;
                  let attributeCode = ask.attributeCode;

                  return <Input
                    isHorizontal={this.props.isHorizontal}
                    key={index}
                    identifier={ask.question.code}
                    data={{
                        value: ask.id
                    }}
                    type={inputType}
                    style={this.props.style}
                    name={ask.question.name}
                    placeholder={''}
                    readOnly={ask.readOnly}
                    optional={ask.optional}
                    validationList={ask.question.validationList}
                    mask={ask.question.mask}
                    onValidation={this.onInputValidation}
                    onClick={this.onClick}
                  />;
              })
          };
        }

      return null;
  }

  render() {

    const { root, style, className } = this.props;
    const componentStyle = { ...style, };

    let questionGroup = AskQuery.getQuestionGroup(root);
    return (
      <div className={`genny-form ${className || ''}`}>
          <Form {...this.props}>
              { questionGroup ? this.renderForm(questionGroup.name, questionGroup.childAsks) : null }
          </Form>
      </div>
    );
  }
}

export default GennyForm;
