import { createContext, useReducer } from 'react'
// import { useEffect } from 'react'


export const KeySocketContext = createContext()

export const keySockReducer = (state, action) => {
    switch (action.type){
        case 'SET_KEYSOCKET':
            return { keySocket: action.payload }
        default:
            return state
            
    } 
}

export const KeySocketProvider = ({ children }) => {
    const [state, dispatchSockey] = useReducer(keySockReducer, {
        keySocket: ''
    })

   
    console.log('KeySocket state: ', state)

    return(
    <KeySocketContext.Provider value={{...state, dispatchSockey}}>
        { children }
    </KeySocketContext.Provider>
    )
}