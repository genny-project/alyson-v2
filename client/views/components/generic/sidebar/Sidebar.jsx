import './sidebar.scss';
import React, { Component } from 'react';
import { ImageView, IconSmall } from '../../../components'
import { object, bool, string, any } from 'prop-types';
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

    render() {

        const { style, src, caption, children, height, } = this.props;
        const { isOpen } = this.state;

        const componentStyle = {
            ...style,
        };

        let image = null;
        if ( src ) {
            image = <div className='sidebar-image' position={[0,0]}><ImageView src={src} caption={caption} style={{ maxWidth: "100px" }}/></div>;
        }
        let icon = <IconSmall className={`sidebar-toggle-icon clickable`}
                name="menu"
                onClick={this.handleSidebarToggle}
                position={[0,0]}
            />

        return (
                <Grid 
                    className={`sidebar ${window.getScreenSize()} ${isOpen ? '' : 'closed'}`}
                    style={componentStyle}
                    rows={["200px", {"style": { "flex": "1, 1, auto", "overflow": "scroll"} }]}
                    cols={1}>

                    {icon}
                    {image}
                    {children}
                </Grid>
        );
    }
}

export default Sidebar;
