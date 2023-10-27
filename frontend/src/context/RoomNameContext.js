import { createContext, useReducer } from 'react'
// import { useEffect } from 'react'


export const RoomNameContext = createContext()

export const roomNameReducer = (state, action) => {
    switch (action.type){
        case 'SET_ROOMNAME':
            return { roomName: action.payload }
        default:
            return state
            
    } 
}

export const RoomNameProvider = ({ children }) => {
    const [state, dispatchroom] = useReducer(roomNameReducer, {
        roomName: ''
    })

   
    console.log('roomNameContext state: ', state)

    return(
    <RoomNameContext.Provider value={{...state, dispatchroom}}>
        { children }
    </RoomNameContext.Provider>
    )
}