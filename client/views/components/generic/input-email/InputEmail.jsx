import './inputEmail.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Label, SubmitStatusIcon, InputText } from 'views/components';
import emailMask from 'text-mask-addons/dist/emailMask';

class InputEmail extends Component {

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

        const { value, ...rest } = this.props;
        
        return (
            <div className="input input-email">
                <InputText {...rest} style={{ width: '100%' }} inputMask={emailMask} value={value} />
            </div>
        )
    }
}

export default InputEmail;
