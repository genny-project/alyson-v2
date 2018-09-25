import './gennyForm.scss';
import React, { Component, PureComponent } from 'react';
import { Form } from 'views/components';
import { object, array } from 'prop-types';
import { AskQuery, BaseEntityQuery, GennyBridge } from 'utils/genny';
import { log } from 'util';

class GennyForm extends Component {

    state = {}

    static propTypes = {

    };

    onInputValidation = (newValue, data, ) => {

        let finalValue = newValue;

        //TODO replace searching for the attribute with checking the DATATYPE
        if (data.attributeCode.indexOf('PRICE') != -1 || data.attributeCode.indexOf('FEE') != -1  || data.attributeCode.indexOf('AMOUNT') != -1) {
            finalValue = JSON.stringify({
                amount: newValue,
                currency: 'AUD'
            });
        } else if (data.attributeCode.indexOf('ADDRESS_FULL') != -1) {
            data.attributeCode = data.attributeCode.replace('ADDRESS_FULL', 'ADDRESS_JSON');
        } else if (data.attributeCode.indexOf('PRI_RATING') != -1) {
            data.attributeCode = 'PRI_RATING_RAW';
        }

        GennyBridge.sendAnswer([{
            ...data,
            value: finalValue
        }]);
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //
    //     // we only re-render if the number of form groups has changed. otherwise inputs can take care of themselves. :)
    //     const newQuestionGroups = AskQuery.getQuestionGroup(nextProps.root);
    //     const oldQuestionGroups = AskQuery.getQuestionGroup(this.props.root);
    //     return this.getNumberOfQuestions(newQuestionGroups) != this.getNumberOfQuestions(oldQuestionGroups);
    // }

    onClickEvent = (clickedButton) => {

        if (clickedButton && clickedButton.props) {

            let data = clickedButton.props.data;

            let btnEventData = {
                code: data.code,
                value: JSON.stringify(data),
            };

            // console.log(btnEventData);
            GennyBridge.sendBtnClick('BTN_CLICK', btnEventData);
        }
    }

    onClick = (clickedButton, data) => {

        GennyBridge.sendAnswer([{
            ...data,
            value: data.attributeCode
        }]);
    }

    onSubmit = (questionGroupCode, targetCode, action) => {

        //console.log("Submitting form....");

        if (questionGroupCode) {

            let btnEventData = {
                code: questionGroupCode,
                value: JSON.stringify({
                    targetCode: targetCode,
                    action: action
                }),
            };

            GennyBridge.sendBtnClick('FORM_SUBMIT', btnEventData);
        }
    }

    getNumberOfQuestions = (askGroup, counter) => {

        if (counter == null) counter = 0;

        if (askGroup && askGroup.childAsks) {
            askGroup.childAsks.forEach(childask => counter += this.getNumberOfQuestions(childask, counter));
        } else if (askGroup && !askGroup.childAsks) {
            counter += 1;
        }

        return counter;
    }

    generateFormData(askGroup) {

        if (askGroup && askGroup.childAsks) {

            let submitButtons = [];
            let submitButtonsData = [];
            let availableButtons = [
                'submit',
                'previous',
                'confirm',
                'next',
                'cancel',
                'reset',
                'accept',
                'email',
                'yes',
                'no',
                'print',
                'ok',
                'close'
            ];

          if (askGroup.attributeCode.includes('EMPTY')) return null;

          if (askGroup.attributeCode.includes('BUTTON')) {

              availableButtons.forEach(availableButton => {

                  if (askGroup.attributeCode.indexOf(availableButton.toUpperCase()) > -1) {
                      submitButtonsData.push({
                          index: askGroup.attributeCode.indexOf(availableButton.toUpperCase()),
                          button: 'form-' + availableButton
                      });
                    }
                });
            }

            submitButtons = submitButtonsData.sort((button, button2) => button.index > button2.index).map(button => button.button);

            return {
                title: askGroup.name,
                code: askGroup.questionCode,
                isHorizontal: askGroup.attributeCode.includes('HORIZONTAL'),
                submitButtons: submitButtons,
                onSubmit: (action) => this.onSubmit(askGroup.question.code, askGroup.targetCode, action),
                onGroupValidation: this.onGroupValidation,
                content: askGroup.childAsks.map((ask, index) => {

                    if (ask.childAsks && !ask.attributeCode.includes('EMPTY')) return this.generateFormData(ask);

                    let inputType = 'Text';
                    let valList = [];
                    let default_value = '';
                    let placeholder = '';
                    let be_code = ask.targetCode;
                    let attributeCode = ask.attributeCode;
                    let options = [];
                    let inputMask = null;

                    if (be_code && attributeCode) {

                        const att = BaseEntityQuery.getBaseEntityAttribute(be_code, attributeCode);

                        if (att != null) {
                            default_value = att.value;
                        }
                    }

                    if (attributeCode) {

                        const att_details = BaseEntityQuery.getAttribute(attributeCode);

                        if (att_details) {
                            placeholder = att_details.placeholder;

                            if (att_details.dataType != null) {

                                if (att_details.dataType.inputmask != null) {

                                    inputMask = att_details.dataType.inputmask.split(',').map(x => {

                                        if (x.indexOf('d') == 1 || x.indexOf('w') == 1) {
                                            return new RegExp(x);
                                        }

                                        return x;
                                    });
                                }

                                inputType = att_details.dataType.className;

                                if (att_details.dataType.validationList != null) {

                                    valList = att_details.dataType.validationList;
                                    if (valList.length > 0 && valList[0].selectionBaseEntityGroupList && valList[0].selectionBaseEntityGroupList[0]) {

                                        options = BaseEntityQuery.getEntityChildren(valList[0].selectionBaseEntityGroupList[0]).reduce((existing, newEntity) => {

                                            //console.log(newEntity);
                                            existing.push({
                                                name: newEntity.name,
                                                code: newEntity.code,
                                                weight: newEntity.weight,
                                            });

                                            return existing;
                                        }, []);
                                    }
                                }
                            }
                        }
                    }

                    return {
                        isHorizontal: this.props.isHorizontal,
                        key: index,
                        identifier: ask.question.code,
                        data: {
                            askId: ask.id,
                            attributeCode: ask.question.attribute.code,
                            sourceCode: ask.sourceCode,
                            targetCode: ask.targetCode,
                            code: ask.question.code,
                            questionGroup: askGroup.name,
                            identifier: ask.question.code,
                            weight: ask.weight,
                        },
                        type: inputType,
                        style: this.props.style,
                        name: ask.question.name,
                        html: ask.question.html,
                        placeholder: placeholder,
                        value: default_value,
                        readOnly: ask.readOnly,
                        mandatory: ask.mandatory,
                        validationList: valList,
                        mask: ask.question.mask,
                        onValidation: this.onInputValidation,
                        onClick: this.onClick,
                        onClickEvent: this.onClickEvent,
                        options: options,
                        inputMask: inputMask ? inputMask : false,
                        isAccountsManagement: this.props.isAccountsManagement ? true : false, //TODO: to move to ask...
                        showOnlyAccountType: this.props.showOnlyAccountType, //TODO: to move to ask...
                    };
                })
            };
        }

        return [];
    }

    render() {

        const { root, style, className, formStyle } = this.props;
        const componentStyle = {...style, };
        let questionGroup = AskQuery.getQuestionGroup(root);

        return ( <div className = { `genny-form ${className || ''}` } style = { componentStyle } >
            <Form {...this.props }
            data = { questionGroup ? this.generateFormData(questionGroup) : [] }
            style = {
                {...formStyle }
            }/>
            </div>
        );
    }
}

export default GennyForm;
