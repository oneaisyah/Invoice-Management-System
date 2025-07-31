// hooks/useRememberMe.js
import { useContext } from "react";
import { SavedFieldsContext } from "../context/SavedFieldsContext";

const useRememberMe = () => {
    const { dispatch } = useContext(SavedFieldsContext);

    const updateRememberMe = (username, password, rememberMe) => {


        if (rememberMe) {
            dispatch({ type: 'SAVE', usernameField: username, passwordField: password, rememberMeLogin: true });
        } else {
            dispatch({ type: 'UNSAVE', rememberMeLogin: false });
        }
    };

    return { updateRememberMe };
};

export default useRememberMe;