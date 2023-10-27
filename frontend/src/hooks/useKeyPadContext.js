import { KeyboardActivationContext } from '../context/KeyboardActivation'
import { useContext } from 'react'

export const useKeyPadContext = () => {
    const context = useContext(KeyboardActivationContext)

    if(!context){
        throw Error('useCategoryContext must be used inside an CategoryContextProvider')
    }

    return context
}