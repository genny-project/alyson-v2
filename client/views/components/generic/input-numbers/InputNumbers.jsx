import './inputNumbers.scss';
import React, { Component } from 'react';
import { string, object, bool, func } from 'prop-types';
import { Label, InputText } from 'views/components';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';

class InputNumbers extends Component {

    static defaultProps = {
        className: '',
        prefix: '',
    }

    static propTypes = {
        className: string,
        prefix: string,
        style: object,
        value: string,
        mandatory: bool,
        validation: func,
        validationStatus: string,
        name: string
    }

    state = {
        value: this.props.value || '',
        hasChanges: false,
    }

    validateString = (value, identifier, validationList) => {

        const {validation} = this.props;
        let newValue = value.replace(/[^0-9\.]/g,'');
        if(validation) validation(newValue, identifier, validationList);
    }

    render() {

        const { name, mandatory, value, ...rest } = this.props;

        const numberMask = createNumberMask({
            allowDecimal: true,
            prefix: this.props.prefix
        });

        return (
            <div className="input input-numbers">
                { name ?
                    <div className='input-header'>
                        { name ? <Label text={name} /> : null }
                        { mandatory ? <Label className='input-label-required' textStyle={ !this.props.validationStatus ? {color: '#cc0000'} : null} text="*  required" /> : null}
                    </div> :
                null }
                <InputText
                    {...rest}
                    hideHeader
                    style={{ width: '100%' }}
                    inputMask={numberMask}
                    value={value}
                    validation={this.validateString}
                />
            </div>
        );
    }
}

export default InputNumbers;
