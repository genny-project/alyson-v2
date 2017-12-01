import './appContent.scss';
import React, { Component } from 'react';
import { GennyBucketView, GennyForm, GennyTable, GennyList } from '../../';
import { any } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';

class AppContent extends Component {

    static defaultProps = {
    }

    static propTypes = {
      children: any,
    };

    state = {
        sidebarDefault: true,
        sidebarHeight: this.props.sidebar ? this.props.sidebar.style.height ? this.props.sidebar.style.height : '200px' : '0px',
        headerHeight: this.props.header ? this.props.header.style.height ? this.props.header.style.height : '90px' : '0px',
        footerHeight: this.props.footer ? this.props.footer.style.height ? this.props.footer.style.height : '30px' : '0px',
        screenSize: window.getScreenSize(),
      }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions = () => {
        this.setState({
            screenSize: window.getScreenSize(),
        });
    }

    render() {

        const { layout, children } = this.props;
        const { screenSize } = this.state;

        let layoutContent = null;

        if(layout.currentView) {

            // we need to show the table view
            if(layout.currentView.code == "TABLE_VIEW") {
                layoutContent = <GennyTable screenSize={screenSize} showBaseEntity root={layout.currentView.dataCode ? layout.currentView.dataCode : "GRP_USERS"}/>
            }
            // we need to show the bucket view
            else if (layout.currentView.code == "BUCKET_VIEW") {
                layoutContent = <GennyBucketView screenSize={screenSize} root={layout.currentView.dataCode ? layout.currentView.dataCode : "GRP_DRIVER_VIEW"} />
            }
            else if (layout.currentView.code == "LIST_VIEW") {
                layoutContent = <GennyList screenSize={screenSize} root={layout.currentView.dataCode ? layout.currentView.dataCode : "GRP_QUOTES"} />
            }
            else if (layout.currentView.code == "FORM_VIEW") {
                layoutContent = <GennyForm screenSize={screenSize} showProgress={true}/>
            }
        }
        else if (layout.currentSublayout) {
            layoutContent = <LayoutLoader layout={layout.currentSublayout} screenSize={screenSize} />
        }

        if (layoutContent == null) layoutContent = children;

        return (
            <div className="app-content">
                {layoutContent}
            </div>
        );
    }
}

export default AppContent;
