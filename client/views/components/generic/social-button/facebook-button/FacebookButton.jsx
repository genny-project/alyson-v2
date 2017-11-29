import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { Button, IconSmall } from '../../../';

class FacebookButton extends Component {

    static propTypes = {
        onClick: func,
        btn_code: string
    };

    static defaultProps = {
        onClick: () => {},
        btn_code: 'FACEBOOK'
    };

    

    state = {
    };

    render() {
        return (
            <Button text="Fetch Facebook Data" onClick={this.clickHandler} color='#3B5998'>
                Facebook
                <IconSmall fa name="facebook-f"/>
            </Button>
        );
    }
}

export default FacebookButton;
