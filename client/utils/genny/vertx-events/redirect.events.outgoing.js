export const REDIRECT_EVENT = (data, token) => ({

    evt_type: 'REDIRECT_EVT',
    msg_type: "EVT_MSG",
    token: token,
    value: data,
});

export default {
  REDIRECT_EVENT
};
