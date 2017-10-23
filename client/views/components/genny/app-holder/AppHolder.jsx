import './appHolder.scss';
import React, { Component } from 'react';
import { Sidebar, Header, Footer, IconSmall, GennyTable } from '../../';
import { bool, any } from 'prop-types';

class AppHolder extends Component {

    static defaultProps = {
    }

    static propTypes = {
      children: any,
    };

    state = {
        sidebarShrink: false
      }

    handleSidebarSize = () => {
        this.setState(prevState => ({
          sidebarShrink: !prevState.sidebarShrink
        }));
    }

    render() {

        const { children, sidebar, header, footer, layout } = this.props;
        const { sidebarShrink } = this.state;
        const sidebarChildren = children[0];
        const contentChildren = children.slice(1);

        let renderSidebar;
        if ( sidebar ) {
            const sidebarWidth = sidebarShrink ? "50px" : "300px";
            renderSidebar = <div className="app-sidebar" style={{ width: sidebarWidth }} >
                <IconSmall className="app-sidebar-toggle" name="menu" onClick={this.handleSidebarSize}/>
                <Sidebar {...sidebar} >{sidebarChildren}</Sidebar>
            </div>;
        }

        let renderHeader;
        if ( header ) {
            renderHeader = <div className="app-header"><Header {...header} /></div>;
        }

        let renderFooter;
        if ( footer ) {
            renderFooter = <div className="app-footer"><Footer {...footer} /></div>;
        }

        let layoutContent = null;

        if(layout.currentView) {

            // we need to show the table view
            if(layout.currentView.code == "TABLE_VIEW") {
                layoutContent = <GennyTable root={layout.dataCode ? layout.dataCode : "GRP_CONTACTS"}/>
            }
            // we need to show the bucket view
            else if (layout.currentView.code == "BUCKET_VIEW") {

            }
        }

        if(layoutContent == null)  layoutContent = contentChildren;

        return (
          <div className="app-holder">
            {renderSidebar}
            <div className="app-main">
              {renderHeader}
              <div className="app-content">{layoutContent}</div>
              {renderFooter}
            </div>
          </div>
        );
    }
}

export default AppHolder;
