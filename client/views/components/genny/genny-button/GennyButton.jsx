import './gennyButton.scss';
import React, { Component } from 'react';
import { string, any, object, func, number } from 'prop-types';
import { Button } from 'views/components';
import { GennyBridge } from 'utils/genny';

class GennyButton extends Component {

    static defaultProps = {
        buttonCode: null,
        value: null,
        confirmation: null,
        animationDelay: 3000
    }

    static propTypes = {
        buttonCode: string,
        value: object,
        children: any,
        buttonComponentStyle: object,
        buttonStyle: object,
        style: object,
        className: string,
        confirmation: string,
        onClick: func,
        animationDelay: number
    };

    state = {
        isAnimated: false
    };

    componentWillUnmount() {
        clearTimeout(this.state.timer);
    }

    componentDidMount() {

        const height = this.props.buttonCode ? document.getElementById(this.props.buttonCode).clientHeight : null;
        this.currentHeight = height || -1;
    }

    handleClick = () => {

        this.setState({
            isAnimated: true
        }, () => {

            this.state.timer = setTimeout(() => {
                this.setAnimationStop();
            }, this.props.animationDelay);
        });

        if(this.props.buttonCode) {

            const isString = (this.props.value && this.props.value.constructor == String);
            if(isString == false) {
                this.props.value.userCode = GennyBridge.getUser();
            }

            let btnValue = (this.props.value && this.props.value.constructor == String) ? this.props.value : JSON.stringify(this.props.value);

            GennyBridge.sendBtnClick('BTN_CLICK', {
                code: this.props.buttonCode,
                value: btnValue || null,
            });

            if(this.props.onClick) {
                this.props.onClick(this);
            }
        }
    }

    handleConfirmation = (confirmation) => {

        this.setState({
            isAnimated: true
        }, () => {
            this.state.timer = setTimeout(() => {
                this.setAnimationStop();
            }, this.props.animationDelay);
        });

        let shouldFire = confirm(confirmation);

        if (shouldFire == true) {
            this.handleClick();
        } else {
            this.setState({
                isAnimated: false
            });
        }
    }

    setAnimationStop = () => {

        this.setState({
            isAnimated: false
        });
    }

    render() {

        const { children, className, style, buttonComponentStyle, disabled, confirmation, ...rest } = this.props;
        let componentStyle = { ...style };
        let { buttonStyle } = this.props;

        const clickEvent = confirmation ? () => this.handleConfirmation(confirmation) : this.handleClick;

        const buttonHeight = this.currentHeight;
        if (this.state.isAnimated == true && buttonHeight > 0) {

            const buttonWidth = buttonHeight;

            componentStyle = {
                ...componentStyle,
                width: buttonWidth
            }

            buttonStyle = {
                ...buttonStyle,
                width: buttonWidth
            }
        }

        if(buttonStyle.width == null) {
            buttonStyle.width = '100%';
        }

        if(componentStyle.width == null) {
            componentStyle.width = '100%';
        }

        return (
        <div id={this.props.buttonCode} className={`genny-button ${className} ${this.state.isAnimated ? 'animate' : ''}`} style={componentStyle}>
            <Button
                {...rest}
                disabled={disabled}
                onClick={clickEvent}
                buttonStyle={buttonStyle}
                style={ {...buttonComponentStyle, height: componentStyle.height }}
            >
                {
                    this.state.isAnimated ?
                    <div className={'button-spinner'} />
                    :
                    children
                }
            </Button>
        </div>
        );
    }
}

export default GennyButton;
