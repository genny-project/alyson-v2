import { BASE_ENTITY as BASE_ENTITY_MESSAGE } from 'constants';

export const BaseEntity = message => ({
  type: BASE_ENTITY_MESSAGE,
  payload: message,
});

export default {
  BaseEntity
};
