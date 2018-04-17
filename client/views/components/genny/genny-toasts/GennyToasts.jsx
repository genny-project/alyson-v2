import './gennyToasts.scss';
import React, { Component } from 'react';
import { string, number, bool, object, array } from 'prop-types';
import { Toasts } from 'views/components';

class GennyToasts extends Component {

    static propTypes = {
        layout: object
    };

    state = {
    }

    render() {

        const { layout, ...rest } = this.props;
    
        {/*
            sendIncomingVertxMessage({"data_type":"CMD_NOTIFICATION","delete":false,"message":"You have just submitted a quote of 121.00 AUD (Excl GST) for the job: new load posted by Tom","msg_type":"DATA_MSG","style":"info"})
        */}


        if (layout != null && layout.currentNotification) {
            
            const style = layout.currentNotification.style;
            const text = layout.currentNotification.text;
            const shown = layout.currentNotification.shown;
            if (style && text && shown === false) {
                layout.currentNotification.shown = true;
                this.child.notify(text, style);
            }
        }

        return (
            <Toasts {...rest} ref={instance => { this.child = instance; }}/>
        );
    }
}

export default GennyToasts;
