import './timeline.scss';
import React, { Component } from 'react';
import { string, object, array, bool, oneOf } from 'prop-types';
import { DateLabel } from 'views/components';

class Timeline extends Component {

    static defaultProps = {
        className: '',
        items: [
            // {
            //     name: 'item name',
            //     value: 'item value'
            // }
            // {
            //     name: 'Posted',
            //     value: '17 Apr 2018 09:46'
            // },
            // {
            //     name: 'Applied',
            //     value: '17 Apr 2018 09:46'
            // },
            // {
            //     name: 'In Transit',
            //     value: ''
            // },
            // {
            //     name: 'Completed',
            //     value: '17 Apr 2018 09:46'
            // },
            // {
            //     name: 'Paid',
            //     value: ''
            // }
        ],
        hideEmptyItems: false,
        color: '#000',
        background: '#fff',
    }

    static propTypes = {
        className: string,
        style: object,
        items: array,
        hideEmptyItems: bool,
        size: oneOf([
            'sm', 'md', 'lg'
        ]),
        color: string,
        background: string,
    }

    state = {
    }

    checkPreviousItems = (items, index) => {
        const prevItems = items.slice( 0, index - 1).some(item => {
            item.value && item.value.length > 0;
        });

        return prevItems;
    }

    render() {
        const { className, items, style, color, background } = this.props;
        const { } = this.state;
        const componentStyle = { ...style, };

        return (
            <div className={`timeline ${className}`} style={componentStyle}>
                <div
                    style={{
                        height: 'calc(100% - 30px)',
                        borderLeft: `4px solid ${color}`,
                        width: 0,
                        position: 'absolute',
                        top: 15,
                        left: 14
                    }}
                />
                {
                    items &&
                        items instanceof Array &&
                        items.length > 0
                        ? items.map((item, index) => {
                            const isThisItemComplete = item && item.value && item.value.length > 0;
                            const isPrevItemComplete = index == 0 ? true : this.checkPreviousItems(items, index);
                            const text = item.value != null && item.value != '' ? item.value : '—';
                            return (
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: '40px'
                                    }}
                                >
                                    <div
                                        style={{
                                            display: 'flex',
                                            height: '30px',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flex: '0 0 30px',
                                            marginRight: '5px'
                                        }}
                                    >
                                        <div
                                            style={{
                                                height: isThisItemComplete ? 14 : isPrevItemComplete ? 26 : 14,
                                                width: isThisItemComplete ? 14 : isPrevItemComplete ? 26 : 14,
                                                borderRadius: '50%',
                                                border: `4px solid ${color}`,
                                                backgroundColor: isThisItemComplete ? `${color}` : `${background}`,
                                                position: 'relative',
                                                zIndex: 5
                                            }}
                                        />
                                    </div>
                                    <span
                                        style={{
                                            marginRight: '5px',
                                            flex: '1 1 0'
                                        }}
                                    >
                                        {text}
                                    </span>
                                    <DateLabel
                                        format="DD MMM YYYY"
                                        style={{
                                            margin: '0px',
                                            flex: '1 1 0'
                                        }}
                                    >
                                        {item.value}
                                    </DateLabel>
                                </div>
                            );
                        })
                        : null
                }
            </div>
        );
    }
}

export default Timeline;