import './displayHTML.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from 'views/components';

class DisplayHTML extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
        children: any,
        text: any,
        html: any,
    }

    state = {
    }

    render() {
        const { className, children, style, html, text } = this.props;
        const componentStyle = { ...style, };
        const htmlContent = html || text || children;

        return (
            <div className={`content ${className}`}  style={componentStyle} dangerouslySetInnerHTML={{__html: htmlContent}}/>
        );
    }
}

export default DisplayHTML;
