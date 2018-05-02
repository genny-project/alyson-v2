import './splitView.scss';
import React, { Component } from 'react';
import { string, object, array } from 'prop-types';
import { Grid } from '@genny-project/layson';
import { IconSmall } from 'views/components';

class SplitView extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
        children: array,
    }

    state = {
        isMobile: window.getScreenSize() == 'sm',
        isOpen: true
    }

    close = () => {
        //console.log('close');
        this.setState({
            isOpen: true
        });
        //send message to backend
    }

    open = () => {
        //console.log('open');
        this.setState({
            isOpen: false
        });
        //send message to backend
    }

    renderContent = (children) => {
        
        return children.map((child, index) => {
            if (child.$$typeof) {    
                return React.cloneElement(child, {
                    position: [0, index],
                    onClick: index > 0 ? this.close : this.open
                });
            }
        });
    }

    render() {
        const { className, style, children } = this.props;
        const { isMobile, isOpen } = this.state;
        const componentStyle = { ...style, };

        const cols = isMobile ?
            [
                { className: `col split-view-left ${isOpen ? 'open' : 'closed'}` },
                { className: `col split-view-right ${isOpen ? 'open' : 'closed'}` }
            ] :
            [1,4];

        return (
            <Grid
                className={`split-view ${className} ${window.getScreenSize()}`}
                style={componentStyle}
                cols={cols}
                rows={1}
            >
                {
                    isMobile == true ? 
                        <div position={[0,1]} className='split-view-close-button' onClick={this.close}>
                            <IconSmall name='arrow_drop_down' style={{ transform: 'rotate(90deg)' }}/>
                            <span>Back</span>
                        </div>
                    : null
                }
                {this.renderContent(children)}
            </Grid>
        );
    }
}

export default SplitView;
