import toast from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { useAuthContext } from './useAuthContext';
import useRememberMe from './useSavedFields';
import Authentication from '../components/apiWrapper/Authentication';


export const useLogin = () => {

    const { dispatch } = useAuthContext();
    const { updateRememberMe } = useRememberMe();

    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(null);

    const login = async (username, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await Promise.race([
                Authentication.login(username, password),
                timeoutAfter(2)
            ]);

            if (response) {
                console.log("Login success!");
                toast.success('Login successful!', {
                    duration: 2000,
                    className: 'login-success-toast'
                });
                await dispatch({ type: 'LOGIN', payload: response });
                await updateRememberMe('', '', false);
                setIsLoading(false);
                return true;
            }
            setError('Unknown error');
            toast.error(`Login failure!\nUnknown error occurred!\nError status: ${error.status}`);
            setIsLoading(false);
            return false;
        } catch (error) {
            if (error && (error.status === 401 || error.status === 404)) {
                setError('Invalid username or password');
                toast.error('Login failure!\nInvalid username or password', {
                    duration: 2000,
                    className: 'login-failure-toast'
                })
                setIsLoading(false);
                return false;;
            }
            setError('Server error! No response!');
            toast.error('Login failure!\nRequest timeout due to server error!', {
                duration: 2000,
                className: 'login-failure-toast'
            });
            setIsLoading(false);
            return false;
        }
    }

    return { login, isLoading, error }
}

const timeoutAfter = (seconds) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error("Login request timed out. Server may not be responding!"));
        }, seconds * 1000);
    });
}
