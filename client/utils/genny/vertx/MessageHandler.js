import { DATA_MSG, CMD_MSG, EVT_MSG, BULK_MSG } from 'constants';
import events from 'utils/genny/vertx-events';
import store from 'views/store';

class MessageHandler {

    constructor() {

        this.lastBe = new Date().getTime();
        this.beBatch = [];

        setInterval( this.checkMessageBatch, 200 );
      }

    checkMessageBatch = () => {
        if (
          this.beBatch.length > 0 &&
          new Date().getTime() - this.lastBe > 200
        ) {
          this.drainMessageBatch();
        }
      }

      drainMessageBatch = () => {
        const message = this.beBatch.reduce( this.handleReduceMessageBatch, this.beBatch[0] );

        store.dispatch( message );

        // this.beBatch.forEach( message => {
        //   store.dispatch( message );
        // });

        this.beBatch = [];
      }

      handleReduceMessageBatch = ( output, current ) => {
        if ( current.payload.aliasCode ) {
          store.dispatch( current );

          return output;
        }

        return {
          ...output,
          payload: {
            ...output.payload,
            items: [
              ...output.payload.items,
              ...current.payload.items,
            ],
          },
        };
      }

    onMessage(message) {

        /* Check that the message isn't null */
        if (!message) {
            console.warn('[MessageHandler] NULL message sent to message handler. Ignoring.');
            return;
        }

        /* Determine message type */
        const { msg_type } = message;

        /* Check to ensure that the message type is a currently supported one */
        if (msg_type !== DATA_MSG && msg_type !== CMD_MSG && msg_type !== EVT_MSG && message.data_type != 'QBulkMessage') {
            console.warn(`[MessageHandler] ${msg_type} is currently unsupported.`, message);
            return;
        }

        /* Based upon the message type dispatch a redux action */
        let eventType = null;

        if (msg_type === CMD_MSG) {
            eventType = message.cmd_type;
        }

        if (msg_type === DATA_MSG) {
            eventType = message.data_type;
        }

        if (msg_type === EVT_MSG) {
            eventType = message.event_type;
        }

        const handleMessage = (message, eventType) => {

            /* Get the redux action to send */
            const action = events.incoming[eventType];

            if (!action) {
                console.warn(`[MessageHandler] No action creator for events of type ${eventType} `);
                console.warn(message);
                return;
            }

            store.dispatch(action(message));
        };

        /* handle bulk messages */
        if (message.data_type == 'QBulkMessage' && message.messages != null && message.messages.length) {

            let finalMessages = {};

            /* we loop through all the messages and try to merge them as much as we can */
            for (var i = 0; i < message.messages.length; i++) {

                const currentMessage = message.messages[i];

                /* if it is a baseentity message, we try to merge it */
                if(currentMessage.data_type == "BaseEntity") {

                    /* logic is:
                     - we merge all the parentCode null && aliasCode null together
                     - we merge all the parentCode(s) together
                     - we merge all the aliasCode together
                     */

                    if(currentMessage.parentCode == null && currentMessage.aliasCode == null) {

                        if(finalMessages["messages"] == null) {
                            finalMessages["messages"] = currentMessage;
                        }
                        else {

                            /* we merge */
                            finalMessages["messages"].items = finalMessages["messages"].items.concat(currentMessage.items);
                        }
                    }
                    else if(currentMessage.parentCode != null && currentMessage.aliasCode == null) {

                        if(finalMessages[currentMessage.parentCode] == null) {
                            finalMessages[currentMessage.parentCode] = currentMessage;
                        }
                        else {

                            /* to ensure items is an array */
                            if(!finalMessages[currentMessage.parentCode].items.length) {
                                finalMessages[currentMessage.parentCode].items = [];
                            }

                            finalMessages[currentMessage.parentCode].items = finalMessages[currentMessage.parentCode].items.concat(currentMessage.items);
                        }
                    }
                    else {

                        if(finalMessages[currentMessage.aliasCode] == null) {
                            finalMessages[currentMessage.aliasCode] = currentMessage;
                        }
                        else {

                            /* we merge */
                            finalMessages[currentMessage.aliasCode].items = finalMessages[currentMessage.aliasCode].items.concat(currentMessage.items);
                        }
                    }
                }
            }

            /* we send the messages */
            Object.keys(finalMessages).forEach(key => {

                const message = finalMessages[key];
                handleMessage(message, message.data_type);
            })

        }
        // else if ( message.data_type === 'BaseEntity' && !message.delete ) {
        //
        //       /* Add to a batch */
        //       this.beBatch.push(
        //         action( message )
        //       );
        //
        //       this.lastBe = new Date().getTime();
        // }
        else {
            handleMessage(message, eventType);
        }
    }
}

export default MessageHandler;
