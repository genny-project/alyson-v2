.export const CACHE_MISSING = (token, beCode) => ({

    event_type: "EVT_CACHE_MISSING",
    msg_type: "EVT_MSG",
    token: token,
    data: items,
    targetBaseEntityCode: beCode
});

export default {
  CACHE_MISSING
};
