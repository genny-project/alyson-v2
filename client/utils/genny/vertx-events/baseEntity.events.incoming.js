import { BASE_ENTITY as BASE_ENTITY_MESSAGE } from 'constants';

export const BASE_ENTITY = message => ({
  type: BASE_ENTITY_MESSAGE,
  payload: message.params,
});

export default {
  BASE_ENTITY
};
