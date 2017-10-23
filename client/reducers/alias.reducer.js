import { ALIAS } from 'constants';

const initialState = {
    data: {},
};

export default function reducer(state = initialState, action) {

    switch (action.type) {

        case ALIAS:

        return {
            ...state,
            data: {
                ...state.data,
                ...action.payload.items.reduce((existing, alias) => {

                    existing[alias.code] = {
                        ...existing[alias.code],
                        ...alias
                    };
                    
                    return existing;

                }, {}),
            }
        };

        default:
        return state;
    }
}
