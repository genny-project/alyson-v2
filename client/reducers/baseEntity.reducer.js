import { BASE_ENTITY, BASE_ENTITY_DATA, ATTRIBUTE } from 'constants';
import { grabValue } from './utils.reducer';

const initialState = {
  data: {},
  relationships: {}
};

export default function reducer(state = initialState, action) {

  switch (action.type) {

    case BASE_ENTITY:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.items.reduce((existing, item) => {

            existing[item.code] = {
              ...state.data[item.code],
              ...item
            };

            return existing;

          }, {}),
        },
        relationships: {
          ...state.relationships,
          [action.payload.parentCode]: {
            ...state.relationships[action.payload.parentCode],
            ...action.payload.items.reduce((existingItem, newItem) => {
              existingItem[newItem.code] = !action.payload.delete ? { type: BASE_ENTITY } : false;
              return existingItem;
            }, {})
          }
        }
      };

    case BASE_ENTITY_DATA:

    return {
        ...state,
        data: {
            ...state.data,
            ...action.payload.items.reduce((existing, items) => {

                let be = items[0].pk.baseEntity;
                let code = be.code;
                existing[code] = {
                    ...existing[code],
                    ...be,
                    attributes: [
                        ...items.map(item => {
                            return {
                                ...item.attribute,
                                value: grabValue(item)
                            }
                        })
                    ]
                };

                return existing;

            }, {})
        }
    }

    case ATTRIBUTE:
    return {
        ...state,
        data: {
            ...state.data,
            ...action.payload.items.forEach((attribute) => {

                let be_code = attribute.targetCode;
                let attributeCode = attribute.attributeCode;
                let newValue = attribute.value;

                if(!state.data[be_code]) state.data[be_code] = {
                    attributes: []
                };

                let found = false;
                if(state.data[be_code].attributes.length > 0) {
                    state.data[be_code].attributes.forEach(attribute => {
                        if(attribute.code == attributeCode) {
                            attribute.value = newValue;
                            found = true;
                        }
                    });
                }

                if(!found) {

                    state.data[be_code] = {
                        ...state.data[be_code],
                        attributes: [
                            ...(state.data[be_code] ? state.data[be_code].attributes : []),
                            {
                                code: attributeCode,
                                value: newValue
                            }
                        ]
                    };
                }
            }),
        }
    };

    default:
      return state;
  }
}
