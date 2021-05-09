import {useReducer} from "react";
import reducer from "./reducer";

export const State = () => {

    const [state, dispatch] = useReducer(reducer, {
        messages: [],
        notices: [],
    });


    return {state, dispatch}
}



