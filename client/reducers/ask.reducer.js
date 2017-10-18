import { ASK } from 'constants';

const initialState = {
    data: {},
};

export default function reducer(state = initialState, action) {

    switch (action.type) {

        case ASK:
        return {
            ...state,
            data: {
                ...state.data,
                ...action.payload.items.reduce((existing, ask) => {

                    let code = ask.question.code;

                    existing[code] = {
                      ...state.data[code],
                      ...ask,
                      question: {
                          ...ask.question,
                          validationList: [
                              ...(ask.question.attribute.dataType.validationList ? ask.question.attribute.dataType.validationList : [])
                          ],
                          type: ask.question.attribute.dataType.className,
                          attributeCode: ask.question.attribute.code
                      }
                    };

                  return existing;

                }, {}),
            }
        };

        default:
        return state;
    }
}