import './gennyForm.scss';
import React, { Component, PureComponent } from 'react';
import { Form } from 'views/components';
import { object, array } from 'prop-types';
import { AskQuery, BaseEntityQuery, GennyBridge } from 'utils/genny';
import { log } from 'util';

class GennyForm extends Component {

    state = {
    }

    static propTypes = {

    };


    onInputValidation = (newValue, data, mandatory) =>  {

        GennyBridge.sendAnswer([{
            ...data,
            value: newValue
        }]);
    }

    onClickEvent = (clickedButton) => {

        if(clickedButton && clickedButton.props) {

            let data = clickedButton.props.data;

            let btnEventData = {
                code: data.code,
                value: JSON.stringify(data),
            };

            GennyBridge.sendBtnClick("BTN_CLICK", btnEventData);
        }
    }

    onClick = (clickedButton, data) => {

        GennyBridge.sendAnswer([{
            ...data,
            value: data.attributeCode
        }]);
    }

    onSubmit = (questionGroupCode, targetCode, action) => {

        if(questionGroupCode) {

            let btnEventData = {
                code: questionGroupCode,
                value: JSON.stringify({
                    targetCode: targetCode,
                    action: action
                }),
            }

            GennyBridge.sendBtnClick("FORM_SUBMIT", btnEventData);
        }
    }

    generateFormData(askGroup) {

        if(askGroup && askGroup.childAsks) {

            let submitButtons = [];
            let submitButtonsData = [];
            let availableButtons = [
                'submit',
                'previous',
                'next',
                'cancel',
                'reset'
            ];

            if(askGroup.attributeCode.includes("BUTTON")) {

                availableButtons.forEach(availableButton => {

                    if(askGroup.attributeCode.indexOf(availableButton.toUpperCase()) > -1) {
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
                isHorizontal: askGroup.attributeCode.includes("HORIZONTAL"),
                submitButtons: submitButtons,
                onSubmit: (action) => this.onSubmit(askGroup.question.code, askGroup.targetCode, action),
                onGroupValidation: this.onGroupValidation,
                content: askGroup.childAsks.map((ask, index) => {

                    if(ask.childAsks) return this.generateFormData(ask);

                    let inputType = 'Text';
                    let valList = [];
                    let default_value = '';
                    let be_code = ask.targetCode;
                    let attributeCode = ask.attributeCode;
                    let options = [];
                    let inputMask = null;

                    if(be_code && attributeCode) {
                        let att = BaseEntityQuery.getBaseEntityAttribute(be_code, attributeCode);
                        if(att) {
                            default_value = att.value;
                        }
                    }

                    if (ask.question) {

                        if(ask.question.attribute) {
                            if(ask.question.attribute.dataType) {

                                if(ask.question.attribute.dataType.inputmask) {

                                    inputMask = ask.question.attribute.dataType.inputmask.split(',').map(x => {

                                        if(x.indexOf('d') == 1 || x.indexOf('w') == 1) {
                                            return new RegExp(x)
                                        }

                                        return x
                                    });
                                }

                                if(ask.question.attribute.dataType.className) {
                                    inputType = ask.question.attribute.dataType.className;
                                }

                                if(ask.question.attribute.dataType.validationList) {
                                    valList = ask.question.attribute.dataType.validationList;
                                    if(valList.length > 0 && valList[0].selectionBaseEntityGroupList && valList[0].selectionBaseEntityGroupList[0]) {
                                        options = BaseEntityQuery.getEntityChildren(valList[0].selectionBaseEntityGroupList[0]).reduce((existing, newEntity) => {
                                            existing.push({
                                                name: newEntity.name,
                                                code: newEntity.code,
                                            })
                                            return existing;
                                        }, []);
                                    }
                                }
                            }
                        }
                    }

                    return {
                        isHorizontal: this.props.isHorizontal,
                        mandatory: ask.question.mandatory,
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
                        },
                        type: inputType,
                        style: this.props.style,
                        name: ask.question.name,
                        placeholder: '',
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
