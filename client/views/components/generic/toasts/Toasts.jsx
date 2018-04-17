import './toasts.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { IconSmall } from 'views/components';
import { ToastContainer, toast } from 'react-toastify';

class Toasts extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
        children: any,
    }

    state = {
        toasts: []
    }

    componentWillMount() {
        this.toastId = null;
        this.toastIds = [];
    }

    openToast = (id) => {
        // console.log('open: ', id);
        // this.setState({
        //     toasts: [
        //         ...this.state.toasts,
        //         {
        //             id: id
        //         }
        //     ]
        // }, () => {
        //     console.log(this.state.toasts);
        // });
    }

    closeToast = (id) => {
        // console.log('close: ', id);
        // this.setState({
        //     toasts: [
        //         ...this.state.toasts.filter(x => x.id != id),
        //     ]
        // }, () => {
        //     console.log(this.state.toasts);
        // });
    }

    notify = (text, style) => {

        //console.log(this.toastId);
        //console.log(!this.toastIds.some(x => toast.isActive(x)));
        if (!this.toastIds.some(x => toast.isActive(x)) || ( this.toastId == null && this.toastIds.length == 0 ) ) {

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
            this.toastIds.push(this.toastId);
            //console.log(this.toastIds);
        }
    };

    

    render() {
        const { className, style } = this.props;
        const {  } = this.state;
        //console.log(this.toastIds);
        
        return (
            <ToastContainer />
        );
    }
}

export default Toasts;
