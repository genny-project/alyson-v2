import { REDIRECT, SOCIAL_REDIRECT } from 'constants';
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

     case SOCIAL_REDIRECT:

     if(action.payload.items && action.payload.items.redirectUrl) {

        let redirectUrl = action.payload.items.redirectUrl;

        if(action.payload.items.clientId) {
            redirectUrl += "&client_id=" + action.payload.items.clientId;
        }

        if(action.payload.items.redirectUrl) {

            let url = window.location.origin;

            // we also pass some more info so that when we come back we can use this data to post as an answer.
            let json = JSON.stringify({
                sourceCode: action.payload.items.sourceCode,
                targetCode: action.payload.items.targetCode,
                attributeCode: action.payload.items.attributeCode,
                askId: action.payload.items.askId
            });

            if(json) {
                url += "?data_state=" + json;
            }

            redirectUrl += "&redirect_uri=" + url;
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
