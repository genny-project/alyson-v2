export const authInit = token => ({
  'data':{
        code:'AUTH_INIT',
        id:2,
        value:'AUTH_INIT',
        token,
    },
    'msg_type':'EVT_MSG'
});
