import React, { Component } from 'react';
import { any, bool, number } from 'prop-types';
import Transition from 'react-transition-group/Transition';


class Fade extends Component {

    static defaultProps = {
        duration: 300,
        opacityEntering: 0,
        opacityEntered: 1
    }

    static propTypes = {
        duration: number,
        inProp: bool,
        opacityEntering: number,
        opacityEntered: number,
        children: any
    };

    state = {
    };

    render() {
        const { children, duration, opacityEntering, opacityEntered, inProp, } = this.props;

        const defaultStyle = {
            transition: `opacity ${duration}ms ease-in-out`,
            opacity: opacityEntering,
        };

        const transitionStyles =  {
            entering: { opacity: opacityEntering },
            entered:  { opacity: opacityEntered },
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
                        }}>
                            {children}
                        </div>
                    );
                }}
            </Transition>
        );
    }
}

export default Fade;
