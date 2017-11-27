import './gennyButton.scss';
import React, { Component } from 'react';
import {  } from 'prop-types';
import { Button } from '../../';
import { GennyBridge } from 'utils/genny';

class GennyButton extends Component {

    static defaultProps = {
    }

      
    static propTypes = {
    };

    state = {
    }

    handleClick = () => {
        /* Send the Genny event */
        
        // this.sendData('BTN_CLICK', {
        //     code: 'TV1',
        //     value: item.code
        // }, item.code);

        console.log('click');
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
