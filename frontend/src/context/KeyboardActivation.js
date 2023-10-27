import { createContext, useReducer } from 'react'
// import { useEffect } from 'react'


export const KeyboardActivationContext = createContext()

export const keyboardReducer = (state, action) => {
    switch (action.type){
        case 'SET_KEPADS':
            return { keyboard: action.payload }
        default:
            return state
            
    } 
}

export const KeyBoardProvider = ({ children }) => {
    const [state, dispatchkey] = useReducer(keyboardReducer, {
        keyboard: true
    })

   
    console.log('KeyboardActivationContext state: ', state)

    return(
    <KeyboardActivationContext.Provider value={{...state, dispatchkey}}>
        { children }
    </KeyboardActivationContext.Provider>
    )
}