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

  onInputValidation = (newValue, data) =>  {

    GennyBridge.sendAnswer([{
        ...data,
        value: newValue
    }]);
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

  renderForm(title, asks) {

      if(asks) {

          return {
              title: title,
              content: asks.map((ask, index) => {

                  let inputType = 'Text';
                  if(ask.childAsks) return this.renderForm(ask.name, ask.childAsks);
                  if (ask.question) {
                     if(ask.question.attribute){
                         if(ask.question.attribute.dataType){
                            if(ask.question.attribute.dataType.className){
                                inputType = ask.question.attribute.dataType.className;
                            }
                         }
                     }
                  }
                    
                    
                  console.log(ask.question);
                  
                  let default_value = null;
                  let be_code = ask.targetCode;
                  let attributeCode = ask.attributeCode;

                  return <Input
                    isHorizontal={this.props.isHorizontal}
                    key={index}
                    identifier={ask.question.code}
                    data={{
                        askId: ask.id,
                        attributeCode: ask.question.attributeCode,
                        sourceCode: ask.sourceCode,
                        targetCode: ask.targetCode,
                    }}
                    type={inputType}
                    style={this.props.style}
                    name={ask.question.name}
                    placeholder={''}
                    readOnly={ask.readOnly}
                    optional={ask.optional}
                    validationList={ask.question.attribute.dataType.validationList}
                    mask={ask.question.mask}
                    onValidation={this.onInputValidation}
                    onClick={this.onClick}
                  />;
              })
          };
        }

      return [];
  }

  render() {

    const { root, style, className } = this.props;
    const componentStyle = { ...style, };

    let questionGroup = AskQuery.getQuestionGroup(root);

    return (
      <div className={`genny-form ${className || ''}`}>
          <Form {...this.props}>
              { questionGroup ? this.renderForm(questionGroup.name, questionGroup.childAsks) : [] }
          </Form>
      </div>
    );
  }
}

export default GennyForm;
