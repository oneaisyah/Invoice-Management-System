import {createContext, useReducer} from 'react';

export const AuthContext = createContext();

export const authReducer = (state, action) => {
    switch (action.type) {

        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload));
            return {user: action.payload }
        case 'LOGOUT':
            if (localStorage.getItem('user')) {
                localStorage.removeItem('user')
            }
            return {user: null }
        default:
            return state
    }

}

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
    })

    //* dispatch are the actions "dispatched" to reducer functions, to be reduced by reducer functions.
    return (
        <AuthContext.Provider value = {{...state, dispatch}}>
            
        {children}
            
        </AuthContext.Provider>
    )

}