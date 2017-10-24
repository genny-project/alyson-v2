import { BASE_ENTITY, BASE_ENTITY_DATA, ATTRIBUTE } from 'constants';
import { grabValue } from './utils.reducer';

const initialState = {
  data: {},
  relationships: {}
};

export default function reducer(state = initialState, action) {

  switch (action.type) {

    case BASE_ENTITY:
    case BASE_ENTITY_DATA:

      return {
        ...state,
        data: {
          ...state.data,
          ...action.payload.items.reduce((existing, newItem) => {

            let baseEntityCode = newItem.code;
            let newAttributes = newItem.baseEntityAttributes || [];

            let existingAttributes = (existing[baseEntityCode] ? existing[baseEntityCode].attributes : {});
            newAttributes.forEach(newAttribute => {

                existingAttributes[newAttribute.attributeCode] = {
                    ...existingAttributes[newAttribute.attributeCode],
                    ...newAttribute,
                    ... {
                        value: grabValue(newAttribute),
                        baseEntityCode: baseEntityCode
                    }
                };
            });

            existing[baseEntityCode] = {
                ...state.data[baseEntityCode],
                ...existing[baseEntityCode],
                ...newItem,
                attributes: existingAttributes
            };

            delete existing[baseEntityCode].baseEntityAttributes;
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
