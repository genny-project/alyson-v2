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
    IconSmall,
    GennyPasscode,
    SplitView
} from 'views/components';
import { any, object } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { BaseEntityQuery } from 'utils/genny';
import store from 'views/store';
import { ToastContainer, toast } from 'react-toastify';

class AppContent extends Component {

    static defaultProps = {}

    static propTypes = {
        style: object,
        children: any,
        layout: object,
        history: object,
    }

    state = {
        showModal: false
    }

    componentWillMount() {

        this.toastId = null;
    }

    renderContent = (commandType, commandData) => {

        if(commandType && commandData.data != null) {

            // we need to show the table view
            if (commandData.code == 'TABLE_VIEW') {
                return <GennyTable root = { commandData.data }
                />;
            }
            // we need to show the bucket view
            else if (commandData.code == 'BUCKET_VIEW') {
                return <GennyBucketView root={commandData.data} />;
            }
            else if (commandData.code == 'LIST_VIEW') {
                return <GennyList root={commandData.data} showTitle/>;
            }
            else if (commandData.code == 'FORM_VIEW') {
                return <GennyForm root={commandData.data}/>;
            }
            else if (commandData.code == 'MAP_VIEW') {
                return <GennyMap root={commandData.data}/>;
            }
            else if (commandData.code == 'LOADING') {
                return <Spinner text={commandData.data} />;
            }
            else if (commandData.code == 'MAP_VIEW') {
                return <GennyMap root={commandData.data}/>;
            }
            else if (commandData.code == 'PASSCODE') {
                return <GennyPasscode />;
            }
            else if (commandData.code == 'CONVERSATION_VIEW') {
                return <GennyMessagingConversation root={commandData.data}/>;
            }
            else if (commandData.code == 'SPLIT_VIEW') {
                let children = commandData.data.map(item => {
                    return this.renderContent('view', item);
                });
                return (
                    < SplitView >
                        {children}
                    </SplitView>
                );
            } else if (commandData.layout != null) {

                const parent = BaseEntityQuery.getBaseEntityParent(commandData.data);
                const parentCode = parent ? parent.code : null;
                return <LayoutLoader layout = { commandData }
                aliases = {
                    { ROOT: parentCode, BE: commandData.data, ITEMCODE: commandData.data }
                }
                />;
            }
        }
    }

    toggleModal = () => {

        console.log(" toggling modal ");

        // re render
        if (store && store.getState()) {
            store.getState().layouts.currentModal = null;
            this.setState({
                showModal: true
            });
        }
    }

    notify = (text, style) => {

        if (!toast.isActive(this.toastId)) {

            let content = ( <div className = 'toast-notification' >
                <IconSmall name = 'notifications' />
                <span > { text } </span>
            </div> );

            switch (style) {

                case 'success':
                    this.toastId = toast.success(content, {
                        autoClose: 30000
                    });
                    break;

                case 'error':
                    this.toastId = toast.error(content, {
                        autoClose: 30000
                    });
                    break;

                case 'warning':
                    this.toastId = toast.warning(content, {
                        autoClose: 30000
                    });
                    break;

                case 'info':
                    this.toastId = toast.info(content, {
                        autoClose: 30000
                    });
                    break;

                default:
                    this.toastId = toast(text);
            }
        }
    };

    render() {

        const { layout, style, children } = this.props;
        const componentStyle = {...style };

        let layoutContent = null;
        let modalContent = null;

        if (layout != null && layout.currentView) {
            layoutContent = this.renderContent('view', layout.currentView);
        } else if (layout.currentSublayout && layout.currentSublayout.layout) {
            const parent = BaseEntityQuery.getBaseEntityParent(layout.currentSublayout.root);
            const parentCode = parent ? parent.code : null;
            layoutContent = <LayoutLoader layout={ layout.currentSublayout } aliases={{ ROOT: parentCode, BE: layout.currentSublayout.root, ITEMCODE: layout.currentSublayout.root }}/>;
        }

        if (layout != null && layout.currentModal) {
            modalContent = this.renderContent('popup', layout.currentModal);
        }

        {/*
            sendIncomingVertxMessage({"msg_type":"CMD_MSG","cmd_type":"CMD_NOTIFICATION","style":"success", "text": "You've Got Quote!"})
        */}

        if (layout != null && layout.currentNotification) {
            const style = layout.currentNotification.style;
            const text = layout.currentNotification.text;
            const shown = layout.currentNotification.shown;
            console.log(layout.currentNotification);
            if (style && text && shown === false) {
                layout.currentNotification.shown = true;
                this.notify(text, style);
            }
        }

        return (
            <div className = "app-content" style={ componentStyle } >
                { /* <span onClick={this.notify} >TOAST</span> */ }
                <ToastContainer /> 
                {
                    modalContent ?
                    < Modal show={ true } onClick={ this.toggleModal } > { modalContent } </Modal> : null} { layoutContent || children
                }
            </div>
        );
    }
}

export default AppContent;