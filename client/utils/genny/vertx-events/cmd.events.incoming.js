import { GPS_CMD } from 'constants';

export const CMD_GPS = message => ({
  type: GPS_CMD,
  payload: message,
});

export default {
    CMD_GPS,
};
