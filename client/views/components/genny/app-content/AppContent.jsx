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
        showModal: false,
        toasts: []
    }

    componentWillMount() {
        this.toastId = null;
        //this.toastCount = 0;
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
            else if (commandData.code == 'CONVERSATION_VIEW') {
                return <GennyMessagingConversation root={commandData.root || commandData.data}/>;
            }
            else if (commandData.code == 'SPLIT_VIEW') {
                let children = commandData.root.map(item => {
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

    openToast = (id) => {
        console.log('open: ', id);
        this.setState({
            toasts: [
                ...this.state.toasts,
                {
                    id: id
                }
            ]
        }, () => {
            console.log(this.state.toasts);
        });
    }

    closeToast = (id) => {
        console.log('close: ', id);
        this.setState({
            toasts: [
                ...this.state.toasts.filter(x => x.id != id),
            ]
        }, () => {
            console.log(this.state.toasts);
        });
    }

    notify = (text, style) => {

        // console.log(text);

        if (!toast.isActive(this.toastId)) {

            let content = ( <div className = 'toast-notification' >
                <IconSmall name = 'notifications' />
                <span > { text } </span>
            </div> );

            // this.toastCount = this.toastCount + 1;
            // const toastNumber = this.toastCount;

            let options = {
                autoClose: 30000,
                // onOpen: () => this.openToast(this.toastId),
                // onClose: () => this.closeToast(this.toastId),
            };

            this.toastId = toast[style](content, options);
            // console.log(this.toastCount, this.toastId);
        }
    };

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

        {/*
            sendIncomingVertxMessage({"data_type":"CMD_NOTIFICATION","delete":false,"message":"You have just submitted a quote of 121.00 AUD (Excl GST) for the job: new load posted by Tom","msg_type":"DATA_MSG","style":"info"})
        */}

        if (layout != null && layout.currentNotification) {
            const style = layout.currentNotification.style;
            const text = layout.currentNotification.text;
            const shown = layout.currentNotification.shown;
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
