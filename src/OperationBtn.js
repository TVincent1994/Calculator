import { ACTIONS } from "./App"

// custom component
// function returns a button to call dispatch function.
export default function OperationBtn({ dispatch, operation }) {             // "dipatch" is the customed attribute to take in parameter "digit". Example: -,+,=,...
    return (
        <button
            onClick={() => dispatch({ type: ACTIONS.CHOOSE_OPERATION, payload: { operation } })}>
            {operation}
        </button>

    )
}