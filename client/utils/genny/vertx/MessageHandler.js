import { DATA_MSG, CMD_MSG, EVT_MSG } from 'constants';
import events from '../vertx-events';
import store from 'views/store';

class MessageHandler {

  onMessage( message ) {

    /* Check that the message isn't null */
    if ( !message ) {
      console.warn( '[MessageHandler] NULL message sent to message handler. Ignoring.' );
      return;
    }

    /* Determine message type */
    const { msg_type } = message;

    /* Check to ensure that the message type is a currently supported one */
    if ( msg_type !== DATA_MSG && msg_type !== CMD_MSG && msg_type !== EVT_MSG ) {
      console.warn( `[MessageHandler] ${msg_type} is currently unsupported.` );
      return;
    }

    /* Based upon the message type dispatch a redux action */
    let eventType = null;

    if ( msg_type === CMD_MSG ) {
      eventType = message.cmd_type;
    }

    if ( msg_type === DATA_MSG ) {
      eventType = message.data_type;
    }

    if ( msg_type === EVT_MSG ) {
      eventType = message.data.evt_type;
    }

    /* Get the redux action to send */
    const action = events.incoming[eventType];

    if ( !action ) {
      console.warn( `[MessageHandler] No action creator for events of type ${eventType} `);
      return;
    }

    store.dispatch(action(message));
  }
}

export default MessageHandler;
