import {
    LAYOUT_CHANGE,
    CMD_VIEW as VIEW_CHANGE,
    CMD_POPUP as POPUP_CHANGE,
    SUB_LAYOUT as SUBLAYOUT_CODE,
    CMD_NOTIFICATION as NOTIFICATION_MESSAGE,
    SUBLAYOUT_CHANGE,
} from 'constants';

export const CMD_LAYOUT = message => ({
  type: LAYOUT_CHANGE,
  payload: message,
});

export const CMD_VIEW = message => ({
  type: VIEW_CHANGE,
  payload: message,
});

export const CMD_POPUP = message => ({
  type: POPUP_CHANGE,
  payload: message,
});

export const CMD_NOTIFICATION = message => ({
  type: NOTIFICATION_MESSAGE,
  payload: message,
});

export const SUB_LAYOUT = message => ({
  type: SUBLAYOUT_CODE,
  payload: message,
});

export const CMD_SUBLAYOUT = message => ({
  type: SUBLAYOUT_CHANGE,
  payload: message,
});

export default {
  CMD_LAYOUT,
  CMD_VIEW,
  CMD_POPUP,
  CMD_SUBLAYOUT,
  CMD_NOTIFICATION,
  SUB_LAYOUT,
};
