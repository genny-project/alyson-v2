import './gennyButton.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { Button } from 'views/components';
import { GennyBridge } from 'utils/genny';

class GennyButton extends Component {

    static defaultProps = {
        buttonCode: null,
        value: null,
        hint: null,
    }

    static propTypes = {
        buttonCode: string,
        value: string,
        hint: string,
    };

    state = {
    }

    handleClick = () => {

        //TODO: to be changed.
        if(this.props.buttonCode) {
            GennyBridge.sendBtnClick("BTN_CLICK", {
                //code: 'LOAD_EDIT',
                code: this.props.buttonCode,
                value: this.props.value || null,
                hint: this.props.hint || null,
            });
        }
    }

    render() {
        const { children, hint, style } = this.props;
        const componentStyle = { ...style, };

        return (
            <div className="genny-button" style={componentStyle}>
                <Button {...this.props} onClick={this.handleClick}>
                    {children}
                </Button>
            </div>
        );
    }
}

export default GennyButton;
