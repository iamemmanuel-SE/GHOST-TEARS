import { RoomNameContext } from '../context/RoomNameContext'
import { useContext } from 'react'

export const useRoomNameContext = () => {
    const context = useContext(RoomNameContext)

    if(!context){
        throw Error('RoomNameContext must be used inside an CategoryContextProvider')
    }

    return context
}