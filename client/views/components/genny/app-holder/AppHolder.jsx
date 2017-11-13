import './appHolder.scss';
import React, { Component } from 'react';
import { Sidebar, Header, Footer, IconSmall, GennyTable, GennyBucketView, GennyList, GennyModal } from '../../';
import { bool, any } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';

class AppHolder extends Component {

    static defaultProps = {
    }

    static propTypes = {
      children: any,
    };

    state = {
        sidebarShrink: false,
        sidebarHeight: this.props.sidebar.style.height ? this.props.sidebar.style.height : '200px',
        headerHeight: this.props.header.style.height ? this.props.header.style.height : '90px',
        footerHeight: this.props.footer.style.height ? this.props.footer.style.height : '30px',
      }

    componentDidMount() {

        let social_code = window.getQueryString('code');
        if(social_code) {

            // sending code as an Answer
            // sourceCode:
            // targetCode:
            // attributeCode:
            // askId:
            // value: social_code
        }
    }

    handleSidebarSize = () => {
        this.setState(prevState => ({
          sidebarShrink: !prevState.sidebarShrink
        }));
    }

    getContentHeight = () => {
        const { headerHeight, footerHeight } = this.state;

        let h = Number(headerHeight.substr(0,headerHeight.length-2));
        let f = Number(footerHeight.substr(0,footerHeight.length-2));

        const otherHeight = h + f;
        return {height: `calc(100vh - ${otherHeight}px)`}
    }

    render() {

        const { children, sidebar, header, footer, layout } = this.props;
        const { sidebarShrink, sidebarHeight, headerHeight, footerHeight } = this.state;
        const sidebarChildren = children[0];
        const ctn = children.slice(1);
        const contentChildren = ctn;
        const contentHeight = this.getContentHeight();

        let renderSidebar;
        if ( sidebar ) {
            const sidebarWidth = sidebarShrink ? "50px" : "300px";
            renderSidebar = <div className="app-sidebar" style={{ minWidth: sidebarWidth }} >
                <IconSmall className="app-sidebar-toggle" name="menu" onClick={this.handleSidebarSize}/>
                <Sidebar {...sidebar} height={sidebarHeight} >{sidebarChildren}</Sidebar>
            </div>;
        }

        let renderHeader;
        if ( header ) {
            renderHeader = <div className="app-header"><Header {...header} height={headerHeight} /></div>;
        }

        let renderFooter;
        if ( footer ) {
            renderFooter = <div className="app-footer"><Footer {...footer} /></div>
        }

        let layoutContent = null;

        if(layout.currentView) {

            // we need to show the table view
            if(layout.currentView.code == "TABLE_VIEW") {
                layoutContent = <GennyTable root={layout.dataCode ? layout.dataCode : "GRP_USERS"}/>
            }
            // we need to show the bucket view
            else if (layout.currentView.code == "BUCKET_VIEW") {
                layoutContent = <GennyBucketView root={layout.dataCode ? layout.dataCode : "GRP_DRIVER_VIEW"} />
            }
            else if (layout.currentView.code == "LIST_VIEW") {
                layoutContent = <GennyList root={layout.dataCode ? layout.dataCode : "GRP_QUOTES"} />
            }
        }
        else if (layout.currentSublayout) {
            console.log(layout.currentSublayout);
            layoutContent = <LayoutLoader layout={layout.currentSublayout} />
        }

        let renderModal;
        if(layout.isShowingModal) {
            renderModal = <GennyModal root={layout.isShowingModal ? layout.isShowingModal : "SUBLAY_1"} />
        }

        if(layoutContent == null)  layoutContent = contentChildren;

        return (
          <div className="app-holder" style={{backgroundColor: "white"}}>
            {renderSidebar}
            <div className="app-main">
              {renderHeader}
              <div className="app-content" style={contentHeight}>{layoutContent}</div>
              {renderFooter}
            </div>
            {renderModal}
          </div>
        );
    }
}

export default AppHolder;
