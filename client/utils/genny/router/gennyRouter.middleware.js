import { CMD_VIEW_PAGE_CHANGE, CMD_VIEW, SUBLAYOUT_CHANGE } from 'constants';
import { push } from 'react-router-redux';


/**
 * @BUGS KNOWN / POTENTIAL
 *
 * This can potentially break the current view if the user refreshes the page, and
 * the view to be shown has not been loaded yet.
 *
 * The url will continuously be appended to when switching between sub-layouts and layouts on the page.
 *
 * TODO
 *  - Fix the above bugs!
 */

const middleware = store => next => action => {
  const currentRouterLocation = store.getState().router.location || window.location;

  /* Update the URL upon layout change. */
  if ( action.type === CMD_VIEW ) {
    /* Create a new object out of the payload and delete the token from it. */
    const layout = { ...action.payload };
    delete layout.token;

    /* Stringify the payload so it can go into the page URL. */
    const stringifiedLayout = JSON.stringify( layout );

    /* Dispatch a push to the browser history so that the layout is saved in the URL. */
    store.dispatch( push( stringifiedLayout ));
  }

  /* Update the URL upon sub-layout change. */
  if ( action.type === SUBLAYOUT_CHANGE ) {
    /* Create a new object out of the payload and delete the token from it. */
    const subLayout = { ...action.payload };
    delete subLayout.token;

    /* Dispatch a push to the browser history so that the layout is saved in the URL. */
    store.dispatch(
      push({
        state: { ...currentRouterLocation.state, subLayout },
        pathname: `${currentRouterLocation.pathname.split( '/' )[1]}/${subLayout.code}`,
      })
    );
  }

  /* Update the layout upon page change. */
  else if ( action.type === '@@router/LOCATION_CHANGE' ) {
    const nextPathname = action.payload.pathname;

    /* Only attempt this if the location pathnames are different. This solves the issue of the view being
     * reverted when the location hash, search or state is updated. */
    if ( currentRouterLocation && currentRouterLocation.pathname !== nextPathname ) {
      try {
        /* Get the stringified layout from the payload, which is ultimately from the URL. */
        const stringifiedLayout = action.payload.pathname.split( '/' )[1];
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
        console.error( 'Unable to decode layout from URL', e );
      }
    }
  }

  next( action );
};

export default middleware;
