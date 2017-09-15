import { LAYOUT_CHANGE } from 'constants';

export const CMD_LAYOUT = message => ({
  type: LAYOUT_CHANGE,
  payload: message.code,
});

export default {
  CMD_LAYOUT
};
