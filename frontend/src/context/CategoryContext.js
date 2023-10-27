import { createContext, useReducer } from 'react'
// import { useEffect } from 'react'


export const CategoryContext = createContext()

export const categoryReducer = (state, action) => {
    switch (action.type){
        case 'SET_CATEGORY':
            return { category: action.payload }
        default:
            return state
            
    } 
}

export const CatContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(categoryReducer, {
        category: null
    })

   
    console.log('CategoryContext state: ', state)

    return(
    <CategoryContext.Provider value={{...state, dispatch}}>
        { children }
    </CategoryContext.Provider>
    )
}