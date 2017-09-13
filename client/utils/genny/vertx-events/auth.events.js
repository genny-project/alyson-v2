export const authInit = token => ({
  evt_type: 'AUTH_INIT',
  msg_type: 'EVT_MSG',
  token,
  data: {
    code: 'AUTH_INIT',
  },
});
