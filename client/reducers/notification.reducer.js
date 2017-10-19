import { NOTIFICATION } from 'constants';

const initialState = {
    data: {},
};

export default function reducer(state = initialState, action) {

    switch (action.type) {

        case NOTIFICATION:

        return {
            ...state,
            data: {
                ...state.data,
                [action.payload.code]: {
                    ...action.payload
                }
            }
        };

        default:
        return state;
    }
}
