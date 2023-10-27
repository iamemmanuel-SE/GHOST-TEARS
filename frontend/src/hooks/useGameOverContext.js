import { GameOverContext } from '../context/GameOverContext'
import { useContext } from 'react'

export const useGameOverContext = () => {
    const context = useContext(GameOverContext)

    if(!context){
        throw Error('GameOverContext must be used inside GameOver ContextProvider')
    }

    return context
}