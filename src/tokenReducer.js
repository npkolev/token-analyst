import {
    GET_ALL_TOKENS,
    GET_TOKEN_DETAILS
} from "./tokenActions";

const initialState = {
    allTokens: [],
    activeToken: [],
};

export default function productReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case GET_ALL_TOKENS:
            return {
                ...state,
                allTokens: action.payload
            };
        case GET_TOKEN_DETAILS:
            return {
                ...state,
                activeToken: action.payload
            };
        default:
            return state;
    }
}