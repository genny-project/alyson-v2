export const AUTH_INIT = token => ({

  evt_type: 'AUTH_INIT',
  msg_type: 'EVT_MSG',
  token,
  data: {
    code: 'AUTH_INIT',
  },
});

export const SEND_CODE = code => ({

    evt_type: code,
    msg_type: "EVT_MSG",
    code,
    data: {
        code: code
    }
});

export default {
  AUTH_INIT,
  SEND_CODE
};
