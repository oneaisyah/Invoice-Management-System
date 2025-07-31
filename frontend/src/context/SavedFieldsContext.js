import {createContext, useReducer} from 'react'

export const SavedFieldsContext = createContext();

export const savingStateReducer = (state, action) => {
    switch (action.type) {

        case 'SAVE':
            localStorage.setItem('usernameField', action.usernameField)
            localStorage.setItem('passwordField', action.passwordField)
            localStorage.setItem('rememberMeLogin', action.rememberMeLogin)
            return {}

        case 'UNSAVE':
            if (localStorage.getItem('usernameField')) {
                localStorage.removeItem('usernameField')
            }
            if (localStorage.getItem('passwordField')) {
                localStorage.removeItem('passwordField')
            }
            if (localStorage.getItem('rememberMeLogin')) {
                localStorage.removeItem('rememberMeLogin')
            }
            return {}
        default:
            return state
    }

}

export const SavedFieldsContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(savingStateReducer, {
    })

    //* dispatch are the actions "dispatched" to reducer functions, to be reduced by reducer functions.
    return (
        <SavedFieldsContext.Provider value = {{...state, dispatch}}>
            {children}
        </SavedFieldsContext.Provider>
    )

}