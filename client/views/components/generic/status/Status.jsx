import './status.scss';
import React, { Component } from 'react';
import { string, object } from 'prop-types';

class Status extends Component {

    static defaultProps = {
        className: '',
        color: ''
    }

    static propTypes = {
        className: string,
        style: object,
        color: string
    }

    state = {
        statusColor: null,
        statusClass: null,
    }

    getRenderState = () => {

        switch(this.props.color) {
            case 'success':
            case 'warning':
            case 'urgent':
            return { statusClass: this.props.color };
            default:
            return { statusColor: { background: this.props.color } };
        }
    }

    render() {

        const { className, style } = this.props;
        let renderState = this.getRenderState();
        const componentStyle = { ...style, ...renderState.statusColor };

        return (
            <div className={`status ${className} ${renderState.statusClass}`} style={componentStyle}/>
        );
    }
}

export default Status;
