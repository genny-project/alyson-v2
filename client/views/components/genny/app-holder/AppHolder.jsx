import './appHolder.scss';
import React, { Component } from 'react';
import { Sidebar, Header, Footer, IconSmall, GennyTable, GennyBucketView, GennyList, GennyForm, GennyHeader } from '../../';
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
        sidebarDefault: true,
        sidebarHeight: this.props.sidebar.style.height ? this.props.sidebar.style.height : '200px',
        headerHeight: this.props.header.style.height ? this.props.header.style.height : '90px',
        footerHeight: this.props.footer.style.height ? this.props.footer.style.height : '30px',
        screenSize: window.getScreenSize(),
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

        this.setState({
            screenSize: window.getScreenSize(),
        });
    }

    getSidebarStyle = () => {
        const { sidebarDefault, screenSize } = this.state;
        if ( screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md' ) {
            if (sidebarDefault) {
                return { left: '-300px', minWidth: '300px' }
            }
            else {
                return { left: '0px', minWidth: '300px' }
            }
        }
        else if ( screenSize === 'lg' ) {
            if (sidebarDefault) {
                return { minWidth: '300px' }
            }
            else {
                return { minWidth: '50px' }
            }
        }

    }

    handleSidebarToggle = () => {
        this.setState(prevState => ({
          sidebarDefault: !prevState.sidebarDefault
        }));
    }

    getContentHeight = () => {
        const { headerHeight, footerHeight, sidebarDefault, screenSize } = this.state;

        let h = Number(headerHeight.substr(0,headerHeight.length-2));
        let f = Number(footerHeight.substr(0,footerHeight.length-2));

        const otherHeight = h + f;
        const otherWidth = screenSize === 'lg' ? sidebarDefault ? 300 : 50 : 0;
        return {
            height: `calc(100vh - ${otherHeight}px)`,
            width: `calc(100vw - ${otherWidth}px)`,
        }


    }

    render() {

        const { children, sidebar, header, footer, layout } = this.props;
        const { sidebarDefault, sidebarHeight, headerHeight, footerHeight, screenSize } = this.state;
        const sidebarChildren = children[0];
        const ctn = children.slice(1);
        const contentChildren = ctn;
        const contentStyle = this.getContentHeight();

        let renderSidebar;
        if ( sidebar ) {
            const sidebarStyle = this.getSidebarStyle();

            renderSidebar = <div className={`app-sidebar ${screenSize} ${sidebarDefault ? 'hide' : null}`} style={ sidebarStyle } >
                <IconSmall className={`app-sidebar-toggle`} name="menu" onClick={this.handleSidebarToggle}/>
                <Sidebar {...sidebar} height={sidebarHeight} screenSize={screenSize}>{sidebarChildren}</Sidebar>
            </div>;
        }

        let renderHeader;
        if ( header ) {
            //renderHeader = <div className="app-header"><Header {...header} height={headerHeight} screenSize={screenSize}/></div>;
            renderHeader = <div className="app-header"><GennyHeader {...header} height={headerHeight} screenSize={screenSize}/></div>;
        }

        let renderFooter;
        if ( footer ) {
            renderFooter = <div className="app-footer"><Footer {...footer} /></div>
        }

        let renderShade;
        if (screenSize === 'xs' || screenSize === 'sm' || screenSize === 'md') {
            if (!sidebarDefault) {
                renderShade = <div className='app-shade' onClick={this.handleSidebarToggle} />
            }
        }

        let layoutContent = null;

        if(layout.currentView) {

            // we need to show the table view
            if(layout.currentView.code == "TABLE_VIEW") {
                layoutContent = <GennyTable screenSize={screenSize} root={layout.currentView.dataCode ? layout.currentView.dataCode : "GRP_USERS"}/>
            }
            // we need to show the bucket view
            else if (layout.currentView.code == "BUCKET_VIEW") {
                layoutContent = <GennyBucketView screenSize={screenSize} root={layout.currentView.dataCode ? layout.currentView.dataCode : "GRP_DRIVER_VIEW"} />
            }
            else if (layout.currentView.code == "LIST_VIEW") {
                layoutContent = <GennyList screenSize={screenSize} root={layout.currentView.dataCode ? layout.currentView.dataCode : "GRP_QUOTES"} />
            }
            else if (layout.currentView.code == "FORM_VIEW") {
                layoutContent = <GennyForm screenSize={screenSize} showProgress="true"/>
            }
        }
        else if (layout.currentSublayout) {
            console.log(layout.currentSublayout);
            layoutContent = <LayoutLoader layout={layout.currentSublayout} screenSize={screenSize} />
        }

        if(layoutContent == null)  layoutContent = contentChildren;

        return (
            <div className="app-holder" style={{backgroundColor: "white"}}>
                {renderSidebar}
                <div className="app-main">
                    {renderShade}
                    {renderHeader}
                <div className="app-content" style={contentStyle}>{layoutContent}</div>
                    {renderFooter}
                </div>
            </div>
        );
    }
}

export default AppHolder;
