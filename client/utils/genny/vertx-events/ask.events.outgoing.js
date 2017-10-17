export const ANSWER = (event, data, token) => ({

    event_type: event,
    msg_type: "EVT_MSG",
    token: token,
    data: data
});

export default {
  ANSWER
};
