import { BASE_ENTITY, BASE_ENTITY_DATA } from 'constants';

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
              data: {
                ...(state.data[item.code] ? state.data[item.code].data : {}),
                ...item
              },
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

                // to optimize
                let value = null;
                /*

                  "valueDouble":null,
                  "valueInteger":null,
                  "valueLong":null,
                  "valueDateTime":null,
                  "valueString":"22/01/1980",

                */


                existing[code] = {
                    ...existing[code],
                    ...be,
                    attributes: [
                        ...items.map(item => {

                            if (item.valueDouble) {
                                value = item.valueDouble
                            }
                            else if (item.valueInteger) {
                                value = item.valueInteger
                            }
                            else if (item.valueLong) {
                                value = item.valueLong
                            }
                            else if (item.valueDateTime) {
                                value = item.valueDateTime
                            }
                            else if (item.valueString) {
                                value = item.valueString
                            }

                            return {
                                ...item.attribute,
                                value: value
                            }
                        })
                    ]
                };

                return existing;

            }, {})
        }
    }

    default:
      return state;
  }
}
