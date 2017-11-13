import { REDIRECT, FB_REDIRECT as FACEBOOK } from 'constants';

export const CMD_REDIRECT = message => ({
  type: REDIRECT,
  payload: message.redirect_url
});

export const FB_REDIRECT = message => ({
  type: FACEBOOK,
  payload: message
});

export default {
  CMD_REDIRECT,
  FB_REDIRECT
};
