import { REDIRECT } from 'constants';
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

    default:
      return state;
  }
}
