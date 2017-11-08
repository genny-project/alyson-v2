export const BTN = (data, token) => ({

    event_type : "BTN_CLICK",
    msg_type: "EVENT_MSG",
    data: data,
    token: token,
});

export default {
  BTN
};
