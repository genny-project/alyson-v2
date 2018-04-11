import './template.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import {  } from 'views/components';

class Template extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
        children: any,
    }

    state = {
    }

    render() {
        const { className, children, style } = this.props;
        const {  } = this.state;
        const componentStyle = { ...style, };

        return (
            <div className={`template ${className}`} style={componentStyle}>
                {children}
            </div>
        );
    }
}

export default Template;
