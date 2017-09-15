export const AUTH_INIT = token => ({
  evt_type: 'AUTH_INIT',
  msg_type: 'EVT_MSG',
  token,
  data: {
    code: 'AUTH_INIT',
  },
});

export default {
  AUTH_INIT,
};
