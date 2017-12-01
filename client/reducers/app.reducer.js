import { REDIRECT, SOCIAL_REDIRECT, GPS_CMD } from 'constants';
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

     case GPS_CMD:

     if(action.payload.gpsLocation) {

         let data = {
            latitude: action.payload.gpsLocation.latitude,
            longitude: action.payload.gpsLocation.longitude,
            radius: action.payload.radius,
            enterCode: action.payload.enterCode,
            exitCode: action.payload.exitCode,
         };

         // window.postMessage(JSON.stringify({
         //     "id": action.payload.code,
         //     "data": data
         // }), "*"); // for the react native app to pick up

         // TODO: to be removed. demo only.

         setTimeout(() => {

             let event = {
                 data: {
                     value: "EXIT_SOURCE",
                     code: "BEG_0000003_EXIT_SOURCE"
                 }
             };
             GennyBridge.sendGeofenceData(event.data.value, event.data);

             setTimeout(() => {

                 let event = {
                     data: {
                         value: "ENTER_DESTINATION",
                         code: "BEG_0000003_ENTER_DESTINATION"
                     }
                 };

                 GennyBridge.sendGeofenceData(event.data.value, event.data);

             }, 10000); // 10 seconds after we send the enter_destination event.


         }, 10000); // 10 seconds after we send the exit_source event.
     }

     return state;

    default:
      return state;
  }
}
