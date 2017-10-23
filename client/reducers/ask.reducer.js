import { ASK } from 'constants';
import { grabValue } from './utils.reducer';

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
                      },
                      answerList: {
                          ...(state.data[code] ? state.data[code].answerList : {}),
                          ...ask.answerList,
                          answerList: [
                              ...(state.data[code] ? (state.data[code].answerList ? state.data[code].answerList : {}).answerList : []),
                              ...ask.answerList.answerList.map((existing, newAnswer) => {

                                 existing.value = grabValue(existing);
                                 return existing;
                              })
                          ]
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
