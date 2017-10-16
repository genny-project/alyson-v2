import { BASE_ENTITY as BASE_ENTITY_MESSAGE } from 'constants';
import { BASE_ENTITY_DATA as DATA} from 'constants';

export const BaseEntity = message => ({
  type: BASE_ENTITY_MESSAGE,
  payload: message,
});

export const Data = message => ({
  type: DATA,
  payload: message,
});

export default {
  BaseEntity,
  Data
};
