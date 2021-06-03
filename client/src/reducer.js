export const reducer =  (state, action) => {


    switch (action.type) {

        case 'GET_MESSAGES':
            return {
                ...state,
                messages: action.payload.messages,
            }

        case 'SET_MESSAGES':
            return {
                ...state,
                messages: [...state.messages, action.payload.messages],
            }

        case 'SET_NOTICE':
            return {
                ...state,
                notices: action.payload,
            }

        default:
            return state
    }

};
