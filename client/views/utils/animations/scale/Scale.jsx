import React, { Component } from 'react';
import { any, bool, number, string } from 'prop-types';
import Transition from 'react-transition-group/Transition';

class Scale extends Component {

    static defaultProps = {
        duration: 300,
        scaleEntering: '0.5',
        scaleEntered: '1',
    }

    static propTypes = {
        duration: number,
        inProp: bool,
        scaleEntering: string,
        scaleEntered: string,
        children: any
    };

    state = {
    };

    render() {
        const { children, duration, scaleEntering, scaleEntered, inProp, } = this.props;

        const defaultStyle = {
            transition: `transform ${duration}ms ease-in-out`,
            transform: `scale( ${scaleEntering})`
        };

        const transitionStyles =  {
            entering: {  transform: `scale( ${scaleEntering})` },
            entered:  {  transform: `scale( ${scaleEntered})` },
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

export default Scale;
