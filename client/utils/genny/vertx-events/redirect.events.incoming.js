import { REDIRECT } from 'constants';

export const CMD_REDIRECT = message => ({
  type: REDIRECT,
  payload: message.redirect_url
});

export default {
  CMD_REDIRECT
};
