export const REDIRECT_EVENT = (data, token) => ({

    event_type : 'REDIRECT_EVT',
    msg_type: 'EVT_MSG',
    data: data,
    token: token,
});

export default {
  REDIRECT_EVENT
};
