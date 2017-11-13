import { REDIRECT, FB_REDIRECT } from 'constants';
import history from 'views/history.js';

const initialState = {
    lastRedirect: null,
    openedDropdown: null
};

export default function reducer( state = initialState, action ) {
  switch ( action.type ) {

    case REDIRECT:
      if ( action.payload.indexOf( 'https://' ) > -1 || action.payload.indexOf( 'http://' ) > -1 ) {
        window.location.href = action.payload;
      } else {
        history.push( action.payload );
      }

      return {
        ...state,
        lastRedirect: action.payload
      };

     case FB_REDIRECT:

     if(action.payload.items && action.payload.items.redirectUrl) {

         let redirectUrl = action.payload.items.redirectUrl;
        //&client_id=423902461306952
        //&redirect_uri=http%3A%2F%2Fanishmaharjan.outcome-hub.com%3A8085%2Fsocial%2Foauth_callback%2F
        //&state=secret717635";

        if(action.payload.items.clientId) {
            redirectUrl += "&client_id=" + action.payload.items.clientId;
        }

        if(action.payload.items.redirectUrl) {
            redirectUrl += "&redirect_uri=" + window.location.href;
        }

        window.location.href = redirectUrl;

        return {
            ...state,
        }

     }
     return state;

    default:
      return state;
  }
}
