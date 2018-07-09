import './bucketCard.scss';
import React, { Component } from 'react';
import { string, bool, number, func, object, any } from 'prop-types';

class BucketCard extends Component {
    static defaultProps = {
        className: '',
        title: '',
        description: '',
        isVisible: false,
        level: '',
        showProgress: false,
        progressTotal: null,
        progressCurrent: null,
    }

    static propTypes = {
        className: string,
        title: string,
        description: string,
        isVisible: bool,
        level: string,
        showProgress: bool,
        progressTotal: number,
        progressCurrent: number,
        showMovingOptions: func,
        style: object,
        layout: any,
        backgroundColor: string,
        onClick: func,
    }

    state = {
        isShowingOptions: false,
    }

    handleClick = () => {
        if (this.props.onClick) this.props.onClick(this.props);
    }

    toggleOptions = () => {

        this.setState({
            isShowingOptions: !this.state.isShowingOptions
        });
    }

    moveItem = () => {

        // hide option menu
        this.toggleOptions();

        // show options
        if(this.props.showMovingOptions) {
            this.props.showMovingOptions(this);
        }
    }

    render() {

        const { className, style, backgroundColor, layout, onClick  } = this.props;
        const { isShowingOptions } = this.state;

        const componentStyle = { ...style, backgroundColor: backgroundColor || '' };

        return (
            <div className={`bucket-card ${onClick ? 'clickable' : ''} ${className} ${isShowingOptions ? 'showOptions' : ''}`} style={componentStyle} onClick={onClick ? this.handleClick : null} >
                {layout}
            </div>
        );
    }
}

export default BucketCard;
