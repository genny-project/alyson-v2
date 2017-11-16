import './appHolder.scss';
import React, { Component } from 'react';
import { Sidebar, Header, Footer, IconSmall, GennyTable, GennyBucketView, GennyList, GennyModal, GennyForm } from '../../';
import { bool, any } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { GennyBridge } from 'utils/genny';

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
        width: null,
        height: null,
        screenSize: null,
      }

    componentDidMount() {

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);

        let social_code = window.getQueryString('code');
        let data_string = window.getQueryString("data_state");

        if(social_code) {

            if(data_string) {

                let data = JSON.parse(decodeURIComponent(data_string));
                if(data) {

                    data.value = social_code;
                    GennyBridge.sendAnswer([data]);
                }
            }
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }
    
    updateWindowDimensions = () => {
        let screenSize = '';
        if (window.innerWidth < 576) {
            screenSize = 'xs';
        }
        else if (window.innerWidth >= 576 && window.innerWidth < 768) {
            screenSize = 'sm';
        }
        else if (window.innerWidth >= 768 && window.innerWidth < 992) {
            screenSize = 'md';
        }
        else if (window.innerWidth >= 992) {
            screenSize = 'lg';
        }

        if (screenSize != this.state.screenSize){
            console.log('=============')
            console.log(screenSize);
            console.log('=============')
        } 

        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
            screenSize: screenSize,
        });
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
        const { sidebarShrink, sidebarHeight, headerHeight, footerHeight, screenSize } = this.state;
        const sidebarChildren = children[0];
        const ctn = children.slice(1);
        const contentChildren = ctn;
        const contentHeight = this.getContentHeight();

        let renderSidebar;
        if ( sidebar ) {
            const sidebarWidth = sidebarShrink ? "50px" : "300px";
            renderSidebar = <div className="app-sidebar" style={{ minWidth: sidebarWidth }} >
                <IconSmall className="app-sidebar-toggle" name="menu" onClick={this.handleSidebarSize}/>
                <Sidebar {...sidebar} height={sidebarHeight} screenSize={screenSize}>{sidebarChildren}</Sidebar>
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
                layoutContent = <GennyTable root={layout.currentView.dataCode ? layout.currentView.dataCode : "GRP_USERS"}/>
            }
            // we need to show the bucket view
            else if (layout.currentView.code == "BUCKET_VIEW") {
                layoutContent = <GennyBucketView root={layout.currentView.dataCode ? layout.currentView.dataCode : "GRP_DRIVER_VIEW"} />
            }
            else if (layout.currentView.code == "LIST_VIEW") {
                layoutContent = <GennyList root={layout.currentView.dataCode ? layout.currentView.dataCode : "GRP_QUOTES"} />
            }
            else if (layout.currentView.code == "FORM_VIEW") {
                layoutContent = <GennyForm showProgress="true"/>
            }
        }
        else if (layout.currentSublayout) {
            console.log(layout.currentSublayout);
            layoutContent = <LayoutLoader layout={layout.currentSublayout} screenSize={screenSize} />
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
