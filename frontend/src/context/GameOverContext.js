import { createContext, useReducer } from 'react'
// import { useEffect } from 'react'


export const GameOverContext = createContext()

export const gameOverReducer = (state, action) => {
    switch (action.type){
        case 'SET_GHOSTLETTER':
            return { ghostLett: action.payload }
        default: 
            return state
            
    } 
}

export const GameOverProvider = ({ children }) => {
    const [state, dispatchghost] = useReducer(gameOverReducer, {
        ghostLett: []
    })

   
    console.log('GameOverContext state: ', state)

    return(
    <GameOverContext.Provider value={{...state, dispatchghost}}>
        { children }
    </GameOverContext.Provider>
    )
}