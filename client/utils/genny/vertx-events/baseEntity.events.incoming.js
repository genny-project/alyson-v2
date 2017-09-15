import { BASE_ENTITY as BASE_ENTITY_MESSAGE } from 'constants';

export const BASE_ENTITY = message => ({
  type: BASE_ENTITY_MESSAGE,
  payload: {
    id: message.params.id,
    params: message.params
  },
});

export default {
  BASE_ENTITY
};
