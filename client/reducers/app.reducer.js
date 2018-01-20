import { REDIRECT, SOCIAL_REDIRECT, GPS_CMD, GPS_MONITOR } from 'constants';
import history from 'views/history.js';

const initialState = {
    lastRedirect: null,
    openedDropdown: null,
    gps: {
        initialPosition: 'unknown',
        lastPosition: 'unknown',
        destinations: [],
        monitor: false,
    }
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
            redirectUrl += '&client_id=' + action.payload.items.clientId;
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
                // url += "?state=" + json;
                localStorage.setItem('socialredirect', json);
            }

            redirectUrl += '&redirect_uri=' + url;
        }

        window.location.href = redirectUrl;

        return {
            ...state,
        };
     }

     break;

     case GPS_CMD:

     if(action.payload.gpsLocation) {

         let data = {
             latitude: action.payload.gpsLocation.latitude,
             longitude: action.payload.gpsLocation.longitude,
             radius: action.payload.radius,
             enterCode: action.payload.enterCode,
             exitCode: action.payload.exitCode,
         };

         window.postMessage(JSON.stringify({
             'id': action.payload.code,
             'data': data
         }), '*'); // for the react native app to pick up

         return {
             ...state
         };
     }

     break;

     case GPS_MONITOR:

         window.postMessage(JSON.stringify({
             "id": action.payload.code,
             "data": {
                 "monitor": true,
             }
         }), "*"); // for the react native app to pick up

     return {
         ...state
     };

    default:
      return state;
  }
}
