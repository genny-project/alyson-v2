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
        style: string,
        color: string
    }

    state = {
        statusColor: null,
        statusClass: null,
    }

    getRenderState = () => {

        switch(this.props.color) {
            case "success":
            case "warning":
            case "error":
            return { statusClass: this.props.color }
            break;
            default:
            return { statusColor: { backgroundColor: this.props.color } }
            break;
        }
    }

    render() {

        const { className, style, color } = this.props;
        const { statusColor, statusClass } = this.state;
        let renderState = this.getRenderState();
        const componentStyle = { ...style, ...renderState.statusColor };

        return (
            <div className={`status ${className} ${renderState.statusClass}`} style={{componentStyle}}/>
        );
    }
}

export default Status;
