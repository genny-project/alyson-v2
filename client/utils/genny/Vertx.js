import EventBus from 'vertx3-eventbus-client';

class Vertx {
  constructor() {
    this.eventBus = null;
    this.incomingHandler = () => {};
    this.messageQueue = [];
    this.connected = false;
  }

  init( url ) {
    this.eventBus = new EventBus( url );
    this.eventBus.onopen = () => {
      this.connected = true;
      console.debug( '[Vertx] Connection opened' );

      /* Register a handler for incoming messages */
      this.eventBus.registerHandler( 'address.outbound', ( error, message ) => {
        this.onIncomingMessage( message.body );
      });

      /* Send all messages in the queue */
      this.messageQueue.forEach(( message, i ) => {
        this.sendMessage( message );
        this.messageQueue.splice( i, 1 );
      });
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
