import './appContent.scss';
import React, { Component } from 'react';
import { GennyBucketView, GennyForm, GennyTable, GennyList, GennyMap, Spinner, Modal } from 'views/components';
import { any, object } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { BaseEntityQuery } from 'utils/genny';
import store from 'views/store';

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
        showModal: false
    }

    renderContent = (commandType, commandData) => {

        if(commandType && commandData.dataCode) {

            // we need to show the table view
            if(commandData.code == 'TABLE_VIEW') {
                return <GennyTable root={commandData.dataCode}/>;
            }
            // we need to show the bucket view
            else if (commandData.code == 'BUCKET_VIEW') {
                return <GennyBucketView root={commandData.dataCode} />;
            }
            else if (commandData.code == 'LIST_VIEW') {
                return <GennyList root={commandData.dataCode} />;
            }
            else if (commandData.code == 'FORM_VIEW') {
                return <GennyForm root={commandData.dataCode}/>;
            }
            else if (commandData.code == 'MAP_VIEW') {
                return <GennyMap root={commandData.dataCode}/>;
            }
            else if (commandData.code == 'LOADING') {
                return <Spinner text={commandData.dataCode} />;
            }
            else if (commandData.code == 'MAP_VIEW') {
                return <GennyMap root={commandData.dataCode}/>;
            }
        }
    }

    toggleModal = () => {
       
        if(store && store.getState()) {
            store.getState().layouts.currentModal = null;
            console.log('cancel');
        }
    }

    render() {

        const { layout, style, children } = this.props;
        const componentStyle = {...style};

        let layoutContent = null;
        let modalContent = null;

        console.log('modal center', modalContent);

        if (layout != null && layout.currentView) {
            layoutContent = this.renderContent('view', layout.currentView);
        }
        else if (layout.currentSublayout && layout.currentSublayout.layout) {

            const parent = BaseEntityQuery.getBaseEntityParent(layout.currentSublayout.root);
            const parentCode = parent ? parent.code : null;
            layoutContent =  <LayoutLoader layout={layout.currentSublayout} aliases={{ROOT: parentCode, BE: layout.currentSublayout.root, ITEMCODE: layout.currentSublayout.root}} />;
        }
        
        if (layout != null && layout.currentModal) {
            modalContent = this.renderContent('popup', layout.currentModal);
        }

        return (
            <div className="app-content" style={componentStyle}>
                {modalContent ? <Modal show={true} onClick={this.toggleModal} >{modalContent}</Modal> : null}
                {layoutContent || children}
            </div>
        );
    }
}

export default AppContent;
