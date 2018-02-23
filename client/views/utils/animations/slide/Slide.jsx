import React, { Component } from 'react';
import { any, bool, number, string } from 'prop-types';
import Transition from 'react-transition-group/Transition';

class Slide extends Component {

    static defaultProps = {
        duration: 300,
        heightEntering: '0px',
        heightEntered: '500px',
    }

    static propTypes = {
        duration: number,
        inProp: bool,
        heightEntering: string,
        heightEntered: string,
        children: any
    };

    state = {
    };

    render() {
        const { children, duration, heightEntering, heightEntered, inProp, } = this.props;

        const defaultStyle = {
            transition: `max-height ${duration}ms ease-in-out`,
            maxHeight: heightEntering
        };

        const transitionStyles =  {
            entering: { maxHeight: heightEntering },
            entered:  { maxHeight: heightEntered },
        };

        return (
            <Transition in={inProp} timeout={duration}>
                {(state) => {
                    if (state === 'exited') {
                        return null;
                    }
                    return (
                        <div style={{
                            ...defaultStyle,
                            ...transitionStyles[state],
                            overflow: 'hidden',
                        }}>
                            {children}
                        </div>
                    );
                }}
            </Transition>
        );
    }
}

export default Slide;
