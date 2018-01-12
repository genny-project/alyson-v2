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
                <InputText {...rest} hideHeader style={{ width: '100%' }} inputMask={numberMask} value={value} />
            </div>
        )
    }
}

export default InputCurrency;
