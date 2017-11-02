import { LAYOUT_CHANGE, CMD_VIEW as VIEW_CHANGE, SUBLAYOUT as SUBLAYOUT_CHANGE } from 'constants';

export const CMD_LAYOUT = message => ({
  type: LAYOUT_CHANGE,
  payload: message,
});

export const CMD_VIEW = message => ({
  type: VIEW_CHANGE,
  payload: message,
});

export const Sublayout = message => ({
  type: SUBLAYOUT_CHANGE,
  payload: message,
});

export default {
  CMD_LAYOUT,
  CMD_VIEW,
  Sublayout,
};
