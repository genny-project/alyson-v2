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
    SublayoutLoader,
} from 'views/components';
import { any, object, bool } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { BaseEntityQuery, GennyBridge } from 'utils/genny';
import store from 'views/store';
import { Label } from 'views/components';
import Sidebar from '../../generic/sidebar/Sidebar';

class AppContent extends Component {

    static defaultProps = {
        showSidebar: false,
    }

    static propTypes = {
        style: object,
        children: any,
        layout: object,
        history: object,
        showSidebar: bool,
    }

    state = {
        showModal: false,
    }

    renderContent = (commandType, commandData) => {

        if(commandType && ( commandData.root != null || commandData.data != null) ) {
            
            // we need to show the table view
            if (commandData.code == 'TABLE_VIEW') {
                return <GennyTable root = { commandData.root } columns={commandData.data.columns} actions={commandData.data.actions}/>;
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
            else if (commandData.code == 'TAB_VIEW') {
                return <TabContainer views={commandData.data} />;
            }
            else if (commandData.code == 'MESSAGE_VIEW') {
                return <GennyMessagingList root={commandData.root || commandData.data} selectedItem={commandData.selectedItem}/>;
            }
            else if (commandData.code == 'CONVERSATION_VIEW') {
                return <GennyMessagingConversation root={commandData.root || commandData.data}/>;
            }
            else if (commandData.code == 'SPLIT_VIEW') {
               
                let children = [];

                if ( commandData.data.data != null ) {
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

                const views = commandData.tabs.map(item => {
                    return {
                        title: item.name,
                        icon: item.icon,
                        layout: this.renderContent('view', item.layout)
                    };
                });

                return <TabContainer views={views} />;
            }
            else if (commandData.code == 'DETAIL_VIEW') {
                const parent = BaseEntityQuery.getBaseEntityParent(commandData.root);
                const parentCode = parent ? parent.code : null;

                return <SublayoutLoader
                    layoutCode={commandData.layoutCode}
                    aliases={
                        { BE: commandData.root, GROUP: parentCode }
                    }
                />;
            }
            else if (commandData.layout != null ) {

                const parent = BaseEntityQuery.getBaseEntityParent(commandData.data);
                const parentCode = parent ? parent.code : null;
                return <LayoutLoader
                    layout = { commandData }
                    aliases = {
                        { ROOT: parentCode, BE: commandData.root, ITEMCODE: commandData.root }
                    }
                />;
            }
        }
    }

    renderSidebar = (root) => {
        const project_code = GennyBridge.getProject();
        let projectColor = null;
        if(project_code != null) {
            projectColor = BaseEntityQuery.getBaseEntityAttribute(project_code, 'PRI_COLOR');
        }

        const rootBE = BaseEntityQuery.getBaseEntity('GRP_NOTES');

        if (rootBE === null || rootBE === undefined ) return null;

        return (
            <Sidebar
                closeOnItemClick={false}
                slideFromRight={true}
                icon='edit'
                iconAltStyle
                style={{
                    backgroundColor: projectColor ? projectColor.value : 'none',
                    color: 'white',
                    textAlign: 'center'
                }}
            >
                <div
                    className='sidebarTitle'
                    position={[0,0]}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '50px',
                        position: 'absolute',
                        top: 0,
                        left: 'calc(50% + 10px)',
                        transform: 'translate(-50%)',
                    }}
                >
                    <h2
                        style={{
                            color: 'white',
                            margin: 0,
                        }}
                    >
                        Notes
                    </h2>
                </div>
                {
                    root
                    ? <GennyMessagingConversation
                        className='notes'
                        position={[1,0]}
                        root='GRP_NOTES'
                        itemCode={root}
                        buttonCode='BTN_ADD_NOTE'
                        maxLength={250}
                        reverseDirection
                        showFilters
                        useNewMessageAttributes
                        alwaysShowImage
                        buttonText='Add Note'
                    />
                    : null
                }
            </Sidebar>
        );
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

        const { layout, style, children, showSidebar } = this.props;
        const componentStyle = {...style };

        let layoutContent = null;
        let modalContent = null;
        let itemCode = null;

        if (layout != null && layout.currentView) {
            if (layout.currentView.root) itemCode = layout.currentView.data.rootNotes ? layout.currentView.data.rootNotes :  layout.currentView.root;

            layoutContent = this.renderContent('view', layout.currentView);
        }
        else if (layout.currentSublayout && layout.currentSublayout.layout) {
            itemCode = layout.currentSublayout.root;
            const parent = BaseEntityQuery.getBaseEntityParent(layout.currentSublayout.root);
            const parentCode = parent ? parent.code : null;
            layoutContent = <LayoutLoader layout={ layout.currentSublayout } aliases={{ ROOT: parentCode, BE: layout.currentSublayout.root, ITEMCODE: layout.currentSublayout.root }}/>;
        }

        if (layout != null && layout.currentModal) {
            modalContent = this.renderContent('popup', layout.currentModal);
        }

        const mobileStyle = window.getScreenSize() ? {
            width: '100vw',
            overflowX: 'hidden',
        } : null;

        return (
            <div className = "app-content" style={ componentStyle } >
                <GennyToasts />
                {
                    modalContent
                    ? (
                        < Modal
                            show={ true }
                            onClick={ this.toggleModal }
                        > 
                            { modalContent }
                        </Modal>
                    )
                    : null
                }
                <div
                    style={
                        {
                            height: '100%',
                            flexGrow: 1,
                            overflow: 'scroll',
                            ...mobileStyle,
                        }
                    }
                >
                    { layoutContent || children }
                </div>
                <div
                    style={
                        {
                            height: '100%',
                            flexShrink: 0,
                        }
                    }
                >
                    {
                        showSidebar 
                            ? this.renderSidebar(itemCode)
                            : null
                    }
                </div>
            </div>
        );
    }
}

export default AppContent;
