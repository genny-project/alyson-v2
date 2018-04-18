export const REDIRECT_EVENT = (redirect_code, data, token) => ({

    event_type : redirect_code,
    msg_type: 'EVT_MSG',
    data: data,
    token: token,
});

export default {
  REDIRECT_EVENT
};
