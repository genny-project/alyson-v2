import './gennyButton.scss';
import React, { Component } from 'react';
import { string, any, object} from 'prop-types';
import { Button } from 'views/components';
import { GennyBridge } from 'utils/genny';

class GennyButton extends Component {

    static defaultProps = {
        buttonCode: null,
        value: null,
    }

    static propTypes = {
        buttonCode: string,
        value: object,
    };

    state = {
    }

    handleClick = () => {

        //TODO: to be changed.
        if(this.props.buttonCode) {

            let btnValue = JSON.stringify(this.props.value);

            GennyBridge.sendBtnClick("BTN_CLICK", {
                //code: 'LOAD_EDIT',
                code: this.props.buttonCode,
                value: btnValue || null,
            });
        }
    }

    render() {
        const { children, hint, style, ...rest } = this.props;
        const componentStyle = { ...style, };

        return (
            <div className="genny-button" style={componentStyle}>
                <Button {...rest} onClick={this.handleClick} style={componentStyle}>
                    {children}
                </Button>
            </div>
        );
    }
}

export default GennyButton;
