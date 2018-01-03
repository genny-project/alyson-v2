import './gennyForm.scss';
import React, { PureComponent } from 'react';
import { Form } from 'views/components';
import { object, array } from 'prop-types';
import { AskQuery, BaseEntityQuery, GennyBridge } from 'utils/genny';
import { log } from 'util';

class GennyForm extends PureComponent {

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

    onClick = (clickedButton) => {

        if(clickedButton && clickedButton.props) {

            let data = clickedButton.props.data;

            let btnEventData = {
                code: data.code,
                value: data.askId,
            };

            GennyBridge.sendBtnClick("BTN_CLICK", btnEventData);
        }
    }

    onSubmit = (questionGroupCode) => {

        if(questionGroupCode) {

            let btnEventData = {
                code: questionGroupCode
            }

            GennyBridge.sendBtnClick("FORM_SUBMIT", btnEventData);
        }
    }

    generateFormData(askGroup) {

        if(askGroup && askGroup.childAsks) {

            const showSubmitButton = askGroup.attributeCode && askGroup.attributeCode.includes('BUTTON');

            return {
                title: askGroup.name,
                onSubmit: showSubmitButton ? () => { this.onSubmit(askGroup.question.code) } : null,
                onGroupValidation: this.onGroupValidation,
                content: askGroup.childAsks.map((ask, index) => {

                    if(ask.childAsks) return this.generateFormData(ask);

                    let inputType = 'Text';
                    let valList = [];
                    let default_value = null;
                    let be_code = ask.targetCode;
                    let attributeCode = ask.attributeCode;
                    let options = [];
                    let inputMasks = [];

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
                                    inputMasks.push(ask.question.attribute.dataType.inputmask);
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
                            attributeCode: ask.question.attributeCode,
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
                        optional: ask.optional,
                        validationList: valList,
                        mask: ask.question.mask,
                        onValidation: this.onInputValidation,
                        onClick: this.onClick,
                        options: options,
                        inputMasks: inputMasks.length > 0 ? inputMasks : false,
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
