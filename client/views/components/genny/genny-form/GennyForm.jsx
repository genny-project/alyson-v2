import './gennyForm.scss';
import React, { Component } from 'react';
import { Form } from '../../';
import { object, array } from 'prop-types';
import { AskQuery, BaseEntityQuery, GennyBridge } from 'utils/genny';
import { log } from 'util';

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

        let btnEventData = {
            code: data.code,
            value: data.askId,
        };

        GennyBridge.sendBtnClick(btnEventData);
    }
  }

  generateFormData(askGroup) {

      if(askGroup && askGroup.childAsks) {

          return {
              title: askGroup.name,
              content: askGroup.childAsks.map((ask, index) => {

                  if(ask.childAsks) return this.generateFormData(ask);

                  let inputType = 'Text';
                  let valList = [];
                  if (ask.question) {
                     if(ask.question.attribute){
                         if(ask.question.attribute.dataType){
                            if(ask.question.attribute.dataType.className){
                                inputType = ask.question.attribute.dataType.className;
                            }
                            if(ask.question.attribute.dataType.validationList){
                                valList = ask.question.attribute.dataType.validationList;
                            }
                         }
                     }
                  }

                  let default_value = null;
                  let be_code = ask.targetCode;
                  let attributeCode = ask.attributeCode;

                  if(be_code && attributeCode) {
                      let att = BaseEntityQuery.getBaseEntityAttribute(be_code, attributeCode);
                      if(att) {
                          default_value = att.value;
                      }
                  }

                  return {
                    isHorizontal: this.props.isHorizontal,
                    key: index,
                    identifier: ask.question.code,
                    data: {
                        askId: ask.id,
                        attributeCode: ask.question.attributeCode,
                        sourceCode: ask.sourceCode,
                        targetCode: ask.targetCode,
                        code: ask.question.code,
                        questionGroup: askGroup.name,
                    },
                    type: inputType,
                    style: this.props.style,
                    name: ask.question.name,
                    placeholder: '',
                    value: default_value,
                    readOnly: ask.readOnly,
                    optional: ask.optional,
                    validationList: valList,
                    mask: ask.question.mask,
                    onValidation: this.onInputValidation,
                    onClick: this.onClick,
                  };
              })
          };
        }

      return [];
  }

  render() {
    const { root, style, className, formStyle } = this.props;
    const componentStyle = { ...style, };
    let questionGroup = AskQuery.getQuestionGroup(root);

    return (
      <div className={`genny-form ${className || ''}`} style={componentStyle}>
          <Form {...this.props} data={questionGroup ? this.generateFormData(questionGroup) : []} style={{...formStyle}}/>
      </div>
    );
  }
}

export default GennyForm;
