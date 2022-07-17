import { ACTIONS } from "./App"

// custom component
// function returns a button to call dispatch function.
export default function DigitBtn({ dispatch, digit }) {      // "dipatch" is the customed attribute to take in parameter "digit". Example: 01234...
    return (
        <button
            onClick={() => dispatch({ type: ACTIONS.ADD_DIGIT, payload: { digit } })}>
                {digit}
        </button>
 
    )
}