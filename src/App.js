import React from 'react';
import { useReducer } from 'react';
import './styles.css';
import DigitBtn from "./DigitBtn";
import OperationBtn from './OperationBtn';

// Global Variables: calculator has a couple of actions it uses.
export const ACTIONS = {                            // use "export" so you can use ACTIONS in the "DigitBtn" and "OperationBtn" page.
    ADD_DIGIT: 'add-digit',
    CHOOSE_OPERATION: 'choose-operation',
    CLEAR: 'clear',
    DELETE_DIGIT: 'delete-digit',
    EVALUATE: 'evaluate'        // equal btn
}

// run some code for a new state object
function reducer(state, { type, payload}) {
    switch (type) {
        // actions taken when adding digits.
        case ACTIONS.ADD_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    currentOperand: payload.digit,    // 
                    overwrite: false,
                }
            }
            // don't add another zero if you start off adding a zero.
            if (payload.digit === "0" && state.currentOperand === "0") {
                return state   
            }
            // if you include a period, you won't be able to add another period. No additional periods.
            if (payload.digit === "." && state.currentOperand.includes(".")) {
                return state        
            }
            return {
                ...state,
                currentOperand: `${state.currentOperand || ""}${payload.digit}`, // taking current operand and adding on a digit to the end of it. If current digit is null, thn defualt to an empty string.
            }
        case ACTIONS.CHOOSE_OPERATION:
            // if clicking on an operand, nothing happens.
            if (state.currentOperand == null && state.previousOperand == null) {
                return state
            }
            if (state.currentOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,
                }
            }
            // making current operation to previous
            if (state.previousOperand == null) {
                return {
                    ...state,
                    operation: payload.operation,                   // operation set to payload
                    previousOperand: state.currentOperand,          // equals current
                    currentOperand: null,
                }
            }
            // using the current and previous calculating operation 
            return {
                ...state,
                previousOperand: evaluate(state),
                operation: payload.operation,
                currentOperand: null
            }
        case ACTIONS.CLEAR:
            return {}      // return empty state. Remove everything. Initial state.
        case ACTIONS.DELETE_DIGIT:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    currentOperand: null
                }
            }
            if (state.currentOperand == null) return state
            if (state.currentOperand.length === 1) {
                return {
                    ...state,
                    currentOperand: null
                }
            }
            return {
                ...state,
                currentOperand: state.currentOperand.slice(0, -1),
            }
        case ACTIONS.EVALUATE:
            if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
                return state
            }
            return {
                ...state,
                overwrite: true,
                previousOperand: null,
                operation: null,
                currentOperand: evaluate(state),
            }
    }
}


function evaluate({ currentOperand, previousOperand, operation}) {
    const prev = parseFloat(previousOperand)
    const current = parseFloat(currentOperand)
    if (isNaN(prev) || isNaN(current)) return ""
    let computation = ""
    switch (operation) {
        case "+":
            computation = prev + current
            break
        case "-":
            computation = prev - current
            break
        case "*":
            computation = prev * current
            break
        case "/":
            computation = prev / current
            break
    }
    return computation.toString()                            
}

// format integer like adding comma whenever number input is larger.
const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
})

function formatOperand(operand) {
    if (operand == null) return
    const [integer, decimal] = operand.split(".")
    if (decimal == null) return INTEGER_FORMATTER.format(integer)
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {

    const [{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

    return (
        
        <div className="calc-grid">
            <div className="output">
                <div className="previous-operand">{formatOperand(previousOperand)}{operation}</div>   {/* prevOperand state variable inserted */}
                <div className="current-operand">{formatOperand(currentOperand)}</div>     {/* currentOperand state variable inserted */}
            </div>

            <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR })}>AC</button>
            <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT })}>DEL</button>
            <OperationBtn operation="/" dispatch={dispatch} />   {/* Hex code for division symbol */}
            <DigitBtn digit="1" dispatch={dispatch} />
            <DigitBtn digit="2" dispatch={dispatch} />
            <DigitBtn digit="3" dispatch={dispatch} />
            <OperationBtn operation="*" dispatch={dispatch} />
            <DigitBtn digit="4" dispatch={dispatch} />
            <DigitBtn digit="5" dispatch={dispatch} />
            <DigitBtn digit="6" dispatch={dispatch} />
            <OperationBtn operation="+" dispatch={dispatch} />
            <DigitBtn digit="7" dispatch={dispatch} />
            <DigitBtn digit="8" dispatch={dispatch} />
            <DigitBtn digit="9" dispatch={dispatch} />
            <OperationBtn operation="-" dispatch={dispatch} />
            <DigitBtn digit="." dispatch={dispatch} />
            <DigitBtn digit="0" dispatch={dispatch} />

            {/* Equal button to evaluate calculation */}
            <button
                className="span-two"
                onClick={() => dispatch({ type: ACTIONS.EVALUATE })}
            >
                =
            </button>
        
        </div>
    )
}

export default App;
