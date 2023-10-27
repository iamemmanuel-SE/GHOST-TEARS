import { CategoryContext } from '../context/CategoryContext'
import { useContext } from 'react'

export const useCatContext = () => {
    const context = useContext(CategoryContext)

    if(!context){
        throw Error('useCategoryContext must be used inside an CategoryContextProvider')
    }

    return context
}