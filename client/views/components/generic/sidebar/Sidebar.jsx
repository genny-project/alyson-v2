import './sidebar.scss';
import React, { Component } from 'react';
import { ImageView, IconSmall } from 'views/components';
import { object, string, any, bool } from 'prop-types';
import { Grid } from '@genny-project/layson';

class Sidebar extends Component {
    static defaultProps = {
        closeOnItemClick: true,
        slideFromRight: false
    }

    static propTypes = {
      style: object,
      src: string,
      caption: any,
      children: any,
      height: string,
      closeOnItemClick: bool,
      slideFromRight: bool,
    };

    state = {
        isOpen: false
    }

    componentWillMount() {
        this.state.isOpen = window.getScreenSize() != 'sm' && localStorage.getItem('sidebar_open') == 'true';
    }

    handleSidebarToggle = (event) => {

        event.preventDefault();

        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }), () => {
            localStorage.setItem('sidebar_open', this.state.isOpen);
        });
    }

    handleClick = () => {
        window.location.reload();
    }

    onClick = () => {
        if (this.props.closeOnItemClick) {
            this.setState(prevState => ({
                //isOpen: window.getScreenSize() == 'sm' ? 
                isOpen: true
            }), () => {
                localStorage.setItem('sidebar_open', this.state.isOpen);
            });
        }
    }

    renderChildren = (children) => {

        const childrenWithProps =  React.Children.map(children, child => {
            if (child === null) return child;
            if (child.$$typeof) {
                return React.cloneElement(child, {
                    onClick: this.onClick
                });
            }
            else {
                console.log('Error: Child must be a valid react element');
            }
        });

        return childrenWithProps;
    }

    render() {

        const { style, src, caption, children, slideFromRight } = this.props;
        const { isOpen } = this.state;

        const componentStyle = {
            ...style,
        };
 
        let image = null;
        if ( src ) {
            image = (
                <div className='sidebar-image' position={[0,0]}>
                    <ImageView
                        className='clickable'
                        src={src}
                        caption={caption}
                        style={{ maxHeight: '100px', width: '200px' }}
                        onClick={this.handleClick}
                    />
                </div>
            );
        }
        
        let icon = <IconSmall className={`sidebar-toggle-icon sidebar-toggle-icon-${slideFromRight ? 'right' : 'left'} clickable`}
            name="menu"
            size={32}
            onClick={this.handleSidebarToggle}
            position={[0,0]}
        />;

        return (
            <div className={`sidebar ${window.getScreenSize()} ${!isOpen ? '' : 'closed'}`}>
                <Grid
                    className='sidebar-main'
                    style={componentStyle}
                    rows={[`${image ? '200px' : '0'}`, {style: {  flex: '1, 1, auto', overflowY: 'auto', overflowX: 'hidden', justifyContent: `${!isOpen && window.getScreenSize() == 'sm' ? 'flex-start' : 'initial' }` } }]}
                    cols={1}>
                    {icon}
                    {image}
                    {this.renderChildren(children)}
                </Grid>
            </div>
        );
    }
}

export default Sidebar;
