const checkTokenValidity = async () => {
    try {
        // Get the token from your localStorage (assuming you store it there)
        const token = localStorage.getItem('jwtToken');

        // If there's no token, consider it as invalid
        if (!token) {
            return false;
        }

        // Make a request to your backend server to validate the token
        const response = await fetch('http://localhost:8888/authenticate/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
            },
        });

        // Check if the response status is 200 (success)
        if (response.status === 200) {
            return true;
        }
            return false;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
};

export default checkTokenValidity;