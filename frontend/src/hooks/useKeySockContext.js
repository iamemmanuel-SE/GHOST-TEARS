import { KeySocketContext } from '../context/KeySocketContext'
import { useContext } from 'react'

export const useKeySockContext = () => {
    const context = useContext(KeySocketContext)

    if(!context){
        throw Error('useKeySockContext must be used inside an CategoryContextProvider')
    }

    return context
}