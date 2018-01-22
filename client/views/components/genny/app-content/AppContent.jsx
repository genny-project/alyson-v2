import './appContent.scss';
import React, { Component } from 'react';
import { GennyBucketView, GennyForm, GennyTable, GennyList, GennyMap } from 'views/components';
import { any, object } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';

class AppContent extends Component {

    static defaultProps = {
    }

    static propTypes = {
        style: object,
        children: any,
        layout: object,
        history: object,
    }

    state = {
    }

    render() {

        const { layout, children, style } = this.props;

        let layoutContent = null;

        if(layout.currentView && layout.currentView.dataCode) {

            // we need to show the table view
            if(layout.currentView.code == 'TABLE_VIEW') {
                layoutContent = <GennyTable root={layout.currentView.dataCode}/>;
            }
            // we need to show the bucket view
            else if (layout.currentView.code == 'BUCKET_VIEW') {
                layoutContent = <GennyBucketView root={layout.currentView.dataCode} />;
            }
            else if (layout.currentView.code == 'LIST_VIEW') {
                layoutContent = <GennyList root={layout.currentView.dataCode} />;
            }
            else if (layout.currentView.code == 'FORM_VIEW') {
                layoutContent = <GennyForm root={layout.currentView.dataCode}/>;
            }
            else if (layout.currentView.code == 'MAP_VIEW') {
                layoutContent = <GennyMap root={layout.currentView.dataCode}/>;
            }
            // else if (layout.currentView.code == 'MAP_VIEW') {
            //     layoutContent = (
            //         <div style={{ display: 'flex', height: '100%', weight: '100%'}}>
            //             <GennyMap root={layout.currentView.dataCode}/>
            //             <GennyList root={layout.currentView.dataCode} />
            //         </div>
            //     );
            // }
        }
        else if (layout.currentSublayout && layout.currentSublayout.layout) {
            layoutContent = <LayoutLoader layout={layout.currentSublayout} aliases={{BE: layout.currentSublayout.root, ITEMCODE: layout.currentSublayout.root}} />;
        }

        layoutContent = layoutContent || children;

        const componentStyle = {
            ...style,
        };

        return (
            <div className="app-content" style={componentStyle}>
                {layoutContent}
            </div>
        );
    }
}

export default AppContent;
