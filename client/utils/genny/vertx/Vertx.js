import EventBus from 'vertx3-eventbus-client';
import decode_token from 'jwt-decode';

let session_state = null;

class Vertx {

  constructor() {
    this.eventBus = null;
    this.incomingHandler = () => {};
    this.messageQueue = [];
    this.connected = false;
  }

  init( token, url ) {

    this.eventBus = new EventBus( url );
    this.eventBus.onopen = () => {

      this.connected = true;
      console.debug( '[Vertx] Connection opened' );

      // decode token
      let session_data = decode_token(token);
      if(session_data && session_data.session_state) {

          session_state = session_data.session_state;

          console.log( session_data )
          console.log( session_state );
          /* Register a handler for incoming messages */
          this.eventBus.registerHandler( session_state, ( error, message ) => {
            this.onIncomingMessage( message.body );
          });

          /* Send all messages in the queue */
          this.messageQueue.forEach(( message, i ) => {
            this.sendMessage( message );
            this.messageQueue.splice( i, 1 );
          });
      }
      else {

          console.error( 'no session state found' )
      }
    };
  }

  onIncomingMessage( message ) {
    /* Log an incoming messages */
    console.debug( '[Vertx] (Incoming)', message );

    /* Send the message to the handler if one is specified */
    if ( this.incomingHandler ) {
      this.incomingHandler( message );
    }
  }

  setIncomingHandler( handler ) {
    this.incomingHandler = handler;
  }

  sendMessage( message ) {
    if ( !this.connected ) {
      this.messageQueue.push( message );
    } else {
      console.debug( '[Vertx] (Outgoing)', message );
      this.eventBus.send( 'address.inbound', { data: message });
    }
  }
}

export default new Vertx();
