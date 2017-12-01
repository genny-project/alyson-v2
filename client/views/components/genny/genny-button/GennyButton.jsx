import './gennyButton.scss';
import React, { Component } from 'react';
import { string } from 'prop-types';
import { Button } from '../../';
import { GennyBridge } from 'utils/genny';

class GennyButton extends Component {

    static defaultProps = {
        buttonCode: null,
    }

    static propTypes = {
        buttonCode: string,
    };

    state = {
    }

    handleClick = () => {

        //TODO: to be changed.
        if(this.props.buttonCode) {
            GennyBridge.sendBtnClick({
                code: 'LOAD_EDIT',
                value: this.props.buttonCode,
            });
        }
    }

    render() {
        const { children, style } = this.props;
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
