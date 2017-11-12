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

     if(action.payload.items) {
         console.log(action.payload.items)
         console.log(action.payload.items.clientId);
     }
     return state;

    default:
      return state;
  }
}
