import './inputCurrency.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Label, SubmitStatusIcon, InputText } from 'views/components';
import createNumberMask from 'text-mask-addons/dist/createNumberMask'

class InputCurrency extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
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
            allowDecimal: true
        })

        return (
            <div className="input input-currency">
                { name ?
                    <div className='input-header'>
                        { name ? <Label text={name} /> : null }
                        { mandatory ? <Label className='input-label-required' textStyle={{color: '#cc0000'}} text="*  required" /> : null}
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
        )
    }
}

export default InputCurrency;
