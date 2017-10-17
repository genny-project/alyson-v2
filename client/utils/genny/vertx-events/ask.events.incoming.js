import { ASK as ASK_DATA } from 'constants';

export const Asks = message => ({
  type: ASK_DATA,
  payload: message,
});

export default {
  Asks,
};
