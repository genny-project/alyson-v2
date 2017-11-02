import { SUBLAYOUT } from 'constants';

const initialState = {
    data: {},
};

export default function reducer(state = initialState, action) {

    switch (action.type) {

        case SUBLAYOUT:
        return {
            ...state,
            data: {
                ...state.data
            }
        };

        default:
        return state;
    }
}
