import { CMD_VIEW_PAGE_CHANGE, CMD_VIEW } from 'constants';
import { push } from 'react-router-redux';


const middleware = store => next => action => {
  /* Capture actions that change the view. */
  if ( action.type === CMD_VIEW ) {
    /* Create a new object out of the payload and delete the token from it. */
    const layout = { ...action.payload };
    delete layout.token;

    /* Stringify the payload so it can go into the page URL. */
    const stringifiedLayout = JSON.stringify( layout );

    /* Dispatch a push to the browser history so that the layout is saved in the URL. */
    store.dispatch( push( stringifiedLayout ));
  }

  /* Capture when the page changes. */
  else if ( action.type === '@@router/LOCATION_CHANGE' ) {
    const currentLocation = store.getState().router.location;
    const nextPathname = action.payload.pathname;

    /* Only attempt this if the location pathnames are different. This solves the issue of the view being
     * reverted when the location hash, search or state is updated. */
    if ( currentLocation && currentLocation.pathname !== nextPathname ) {
      try {
        /* Get the stringified layout from the payload, which is ultimately from the URL. */
        const stringifiedLayout = action.payload.pathname.replace( '/', '' );
        /* Convert the layout from the URL to JSON so we can reconstruct the original CMD_VIEW payload. */
        const layout = JSON.parse( stringifiedLayout );

        /* Dispatch an altered CMD_VIEW action with the layout. The reason it is altered
         * is so that the above function (the one that pushes the layout the URL) does not
         * get triggered and send us into an infinite loop of pushing and page changing. */
        store.dispatch({
          type: CMD_VIEW_PAGE_CHANGE,
          payload: layout,
        });
      } catch ( e ) {
        /* Handle failed `JSON.parse`s. */
        console.error( e );
      }
    }
  }

  next( action );
};

export default middleware;
