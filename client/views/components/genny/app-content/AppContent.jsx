import './appContent.scss';
import React, { Component } from 'react';
import { GennyBucketView, GennyForm, GennyTable, GennyList, GennyMap, Spinner, Modal, IconSmall, Passcode } from 'views/components';
import { any, object } from 'prop-types';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { BaseEntityQuery } from 'utils/genny';
import store from 'views/store';
import { ToastContainer, toast } from 'react-toastify';

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

    componentWillMount() {

        this.toastId = null;
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
                return <GennyList root={commandData.dataCode} showTitle/>;
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
            else if (commandData.code == 'PASSCODE') {
                return <Passcode />;
            }
            else if(commandData.layout != null) {

                const parent = BaseEntityQuery.getBaseEntityParent(commandData.dataCode);
                const parentCode = parent ? parent.code : null;
                return <LayoutLoader layout={commandData} aliases={{ROOT: parentCode, BE: commandData.dataCode, ITEMCODE: commandData.dataCode}} />;
            }
        }
    }

    toggleModal = () => {

        // re render
        if(store && store.getState()) {
            store.getState().layouts.currentModal = null;
            this.setState({
                showModal: true
            });
        }
    }

    notify = (text, style) => {

        if (!toast.isActive(this.toastId)) {

            let content = (
                <div className='toast-notification'>
                    <IconSmall name='notifications' />
                    <span>{text}</span>
                </div>
            );

            switch(style) {

                case 'success':
                    this.toastId = toast.success(content, {
                        autoClose: false
                    });
                break;

                case 'error':
                    this.toastId = toast.error(content, {
                        autoClose: false
                    });
                break;

                case 'warning':
                    this.toastId = toast.warning(content, {
                        autoClose: false
                    });
                break;

                case 'info':
                    this.toastId = toast.info(content, {
                        autoClose: false
                    });
                break;

                default:
                this.toastId = toast(text);
            }
        }
    };

    render() {

        const { layout, style, children } = this.props;
        const componentStyle = {...style};

        let layoutContent = null;
        let modalContent = null;

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

        {/*
            sendIncomingVertxMessage({"msg_type":"CMD_MSG","cmd_type":"CMD_NOTIFICATION","style":"success", "text": "You've Got Quote!"})

        */}

        if(layout != null && layout.currentNotification) {
            const style = layout.currentNotification.style;
            const text = layout.currentNotification.text;
            if(style && text) {
                this.notify(text, style);
            }
        }

        return (
            <div className="app-content" style={componentStyle}>
                {/* <span onClick={this.notify} >TOAST</span> */}
                <ToastContainer />
                {modalContent ? <Modal show={true} onClick={this.toggleModal} >{modalContent}</Modal> : null}
                {layoutContent || children}
            </div>
        );
    }
}

export default AppContent;
