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
        console.log('close');
        this.setState({
            isOpen: true
        });
        //send message to backend
    }

    open = () => {
        console.log('open');
        this.setState({
            isOpen: false
        });
        //send message to backend
    }

    renderContent = (children) => {
        
        return children.map((child, index) => {
            if (child.$$typeof) {
                // if (this.state.isMobile && index > 0) {
                //     return (
                //         <div position={[0, index]} >
                //             <div className='conversation-back-button' onClick={this.close}>
                //                 <IconSmall name='arrow_drop_down' style={{ transform: 'rotate(90deg)' }}/>
                //                 <span>Back</span>
                //             </div>
                //             {child}
                //         </div>
                //     );
                // }
                // else {
                    return React.cloneElement(child, {
                        position: [0, index],
                        onClick: index > 0 ? this.close : this.open
                    });
                // }
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
            [1,3];

        return (
            <Grid className={`split-view ${className} ${window.getScreenSize()}`} style={componentStyle} cols={cols} rows={1}>
                {this.renderContent(children)}
            </Grid>
        );
    }
}

export default SplitView;
