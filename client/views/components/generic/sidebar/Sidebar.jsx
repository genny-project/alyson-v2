import './sidebar.scss';
import React, { Component } from 'react';
import { ImageView, IconSmall } from 'views/components';
import { object, string, any } from 'prop-types';
import { Grid } from '@genny-project/layson';

class Sidebar extends Component {

    static propTypes = {
      style: object,
      src: string,
      caption: any,
      children: any,
      height: string,
    };

    state = {
        isOpen: true,
    }

    handleSidebarToggle = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }));
    }

    handleClick = () => {
        window.location.reload();
    }

    render() {

        const { style, src, caption, children, } = this.props;
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
        let icon = <IconSmall className='sidebar-toggle-icon clickable'
                name="menu"
                size={32}
                onClick={this.handleSidebarToggle}
                position={[0,0]}
            />;

        let openStatus = window.getScreenSize() ? isOpen : !isOpen;
            
        return (
            <div className={`sidebar ${window.getScreenSize()} ${openStatus ? '' : 'closed'}`}>
                <Grid
                    className='sidebar-main'
                    style={componentStyle}
                    rows={['200px', {style: {  flex: '1, 1, auto', overflowY: 'auto', overflowX: 'hidden', justifyContent: `${!isOpen && window.getScreenSize() == 'sm' ? 'flex-start' : 'initial' }` } }]}
                    cols={1}>

                    {icon}
                    {image}
                    {children}
                </Grid>
            </div>
        );
    }
}

export default Sidebar;
