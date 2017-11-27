export const BTN = (data, token) => ({

    event_type : "BTN_CLICK",
    msg_type: "EVT_MSG",
    data: data,
    token: token,
});

export default {
  BTN
};
