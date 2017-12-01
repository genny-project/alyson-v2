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
      screenSize: string,
    };

    state = {
        sidebarDefault: true,
    }

    handleSidebarToggle = (event) => {
        event.preventDefault();
        this.setState(prevState => ({
          sidebarDefault: !prevState.sidebarDefault
        }));
    }  

    render() {

        const { style, src, caption, children, height } = this.props;
        const { sidebarDefault } = this.state;

        const componentStyle = {
            ...style,
        };

        let imageView = null;
        if ( src ) {
            imageView = <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}} position={[0,0]}><ImageView src={src} caption={caption} style={{ maxWidth: "100px" }}/></div>;
        }
        let icon = <IconSmall className={`app-sidebar-toggle`}
            name="menu"
            onClick={this.handleSidebarToggle}
            position={[0,0]}
        />

        return (
            <Grid className={`sidebar ${sidebarDefault ? null : 'non-default' }`} style={componentStyle} rows={["200px", "auto"]} cols={1}>
                {icon}
                {imageView}
                {children}
            </Grid>
        );
    }
}

export default Sidebar;
