import './iframe.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from 'views/components';

class iFrame extends Component {

    static defaultProps = {
        src: null,
    }

    static propTypes = {
        src: string,
    }

    shouldComponentUpdate() {
        return false;
    }

    render() {

        const { src } = this.props;

        if(src == null) return null;

        return (
            <div className="iframe" style={{ "flexGrow": 1, "display": "flex", "flexDirection": "column"}}>
                <iframe style={{"flexGrow": 1}} src={src} width="100%" height="100%" frameborder="0"></iframe>
            </div>
        );
    }
}

export default iFrame;
