import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { Button } from '../../../';

class FacebookButton extends Component {

    static propTypes = {
        onClick: func,
        btn_code: string
    };

    static defaultProps = {
        onClick: () => {},
        btn_code: 'FACEBOOK'
    };

    clickHandler = () => {
        this.props.onClick(this.props.btn_code);
    }

    state = {
    };

    render() {
        return (
            <Button text="Fetch Facebook Data" onClick={this.clickHandler}>Fetch Facebook Data</Button>
        );
    }
}

export default FacebookButton;
