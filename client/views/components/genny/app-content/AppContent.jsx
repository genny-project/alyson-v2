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
    }

    render() {

        const { layout, children } = this.props;

        let layoutContent = null;

        if(layout.currentView && layout.currentView.dataCode) {

            // we need to show the table view
            if(layout.currentView.code == "TABLE_VIEW") {
                layoutContent = <GennyTable root={layout.currentView.dataCode}/>
            }
            // we need to show the bucket view
            else if (layout.currentView.code == "BUCKET_VIEW") {
                layoutContent = <GennyBucketView root={layout.currentView.dataCode} />
            }
            else if (layout.currentView.code == "LIST_VIEW") {
                layoutContent = <GennyList root={layout.currentView.dataCode} />
            }
            else if (layout.currentView.code == "FORM_VIEW") {
                layoutContent = <GennyForm root={layout.currentView.dataCode} showProgress={true}/>
            }
        }
        else if (layout.currentSublayout) {
            layoutContent = <LayoutLoader layout={layout.currentSublayout} />
        }

        layoutContent = layoutContent || children;

        return (
            <div className="app-content">
                {layoutContent}
            </div>
        );
    }
}

export default AppContent;
