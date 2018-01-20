import { push } from 'react-router-redux';


const middleware = store => next => action => {
  if ( action.type === 'CMD_VIEW' ) {
    console.log( '==== NEW VIEW ====' );

    const layout = { ...action.payload };
    delete layout.token;

    const stringifiedLayout = JSON.stringify( layout );
    console.log( stringifiedLayout );

    // store.dispatch( push( stringifiedLayout ));
  }

  else if ( action.type === '@@router/LOCATION_CHANGE' ) {
    console.log( 'location change', action.payload );
  }

  next( action );
};

export default middleware;
