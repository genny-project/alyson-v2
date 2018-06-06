import './appContent.scss';
import React, { Component } from 'react';
import {
    GennyBucketView,
    GennyMessagingConversation,
    GennyForm,
    GennyTable,
    GennyList,
    GennyMap,
    Spinner,
    Modal,
    GennyPasscode,
    SplitView,
    GennyToasts,
    GennyMessagingList,
    TabContainer,
} from 'views/components';
import { any, object } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { BaseEntityQuery } from 'utils/genny';
import store from 'views/store';

class AppContent extends Component {

    static defaultProps = {}

    static propTypes = {
        style: object,
        children: any,
        layout: object,
        history: object,
    }

    state = {
        showModal: false,
    }

    renderContent = (commandType, commandData) => {

        if(commandType && ( commandData.root != null || commandData.data != null) ) {

            // we need to show the table view
            if (commandData.code == 'TABLE_VIEW') {
                return <GennyTable root = { commandData.root } columns={commandData.data.columns}/>;
            }
            // we need to show the bucket view
            else if (commandData.code == 'BUCKET_VIEW') {
                return <GennyBucketView root={commandData.root} />;
            }
            else if (commandData.code == 'LIST_VIEW') {
                return <GennyList root={commandData.root || commandData.data } showTitle/>;
            }
            else if (commandData.code == 'FORM_VIEW') {
                return <GennyForm root={commandData.root}/>;
            }
            else if (commandData.code == 'MAP_VIEW') {
                return <GennyMap root={commandData.root}/>;
            }
            else if (commandData.code == 'LOADING') {
                return <Spinner text={commandData.root} />;
            }
            else if (commandData.code == 'MAP_VIEW') {
                return <GennyMap root={commandData.root}/>;
            }
            else if (commandData.code == 'PASSCODE') {
                return <GennyPasscode />;
            }
            else if (commandData.code == 'MESSAGE_VIEW') {
                return <GennyMessagingList root={commandData.root || commandData.data} selectedItem={commandData.selectedItem}/>;
            }
            else if (commandData.code == 'CONVERSATION_VIEW') {
                return <GennyMessagingConversation root={commandData.root || commandData.data}/>;
            }
            else if (commandData.code == 'SPLIT_VIEW') {
                let children = [];
                if ( commandData.root != null ) {
                    children = commandData.root.map(item => {
                        return this.renderContent('view', item);
                    });
                }
                else if ( commandData.data != null ) {
                    children = commandData.data.data.map(item => {
                        return this.renderContent('view', item);
                    });
                }
               
                return (
                    <SplitView>
                        {children}
                    </SplitView>
                );
            }
            else if (commandData.code == 'TAB_VIEW') {

                const views = commandData.data.map(item => {
                    return { 
                        title: item.code,
                        layout: this.renderContent('view', item)
                    };
                });

                return <TabContainer views={views} />;
            }
            else if (commandData.layout != null || ( commandData.code == 'DETAIL_VIEW' && commandData.layoutCode != null) ) {

                const parent = BaseEntityQuery.getBaseEntityParent(commandData.data);
                const parentCode = parent ? parent.code : null;
                return <LayoutLoader layout = { commandData }
                aliases = {
                    { ROOT: parentCode, BE: commandData.root, ITEMCODE: commandData.root }
                }
                />;
            }
        }
    }

    toggleModal = () => {

        // re render
        if (store && store.getState()) {
            store.getState().layouts.currentModal = null;
            this.setState({
                showModal: true
            });
        }
    }

    render() {

        const { layout, style, children } = this.props;
        const componentStyle = {...style };

        let layoutContent = null;
        let modalContent = null;

        if (layout != null && layout.currentView) {
            layoutContent = this.renderContent('view', layout.currentView);
        }
        else if (layout.currentSublayout && layout.currentSublayout.layout) {

            const parent = BaseEntityQuery.getBaseEntityParent(layout.currentSublayout.root);
            const parentCode = parent ? parent.code : null;
            layoutContent = <LayoutLoader layout={ layout.currentSublayout } aliases={{ ROOT: parentCode, BE: layout.currentSublayout.root, ITEMCODE: layout.currentSublayout.root }}/>;
        }

        if (layout != null && layout.currentModal) {
            modalContent = this.renderContent('popup', layout.currentModal);
        }

        return (
            <div className = "app-content" style={ componentStyle } >
                <GennyToasts />
                {
                    modalContent ?
                    < Modal show={ true } onClick={ this.toggleModal } > { modalContent } </Modal> : null} { layoutContent || children
                }
            </div>
        );
    }
}

export default AppContent;
