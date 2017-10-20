import { ATTRIBUTE } from 'constants';

const initialState = {
    data: {},
};

export default function reducer(state = initialState, action) {

    switch (action.type) {

        case ATTRIBUTE:
        return {
            ...state,
            data: {
                ...state.data,
                ...action.payload.items.forEach((attribute) => {

                    let be_code = attribute.targetCode;
                    let attributeCode = attribute.attributeCode;
                    let value = attribute.value;

                    console.log(state);

                }),
            }
        };

        default:
        return state;
    }
}
