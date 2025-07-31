import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, Typography, MenuItem} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import toast from 'react-hot-toast'
// components
import Authentication from '../../../components/apiWrapper/Authentication';
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

export default function RegistrationForm() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState(''); // Add state for username
    const [password, setPassword] = useState(''); // Add state for password

    const [roleLevel, setRoleLevel] = useState('');
    const [creatorRoleLevel, setCreatorRoleLevel] = useState(0);

    const handleClick = async () => {
        //* TODO: Handle login process using XHR
        const roleLevelInteger = Number(roleLevel)
        const data = {
            "username": username,
            "password": password,
            "roleLevel": roleLevelInteger
        };
        const existingToken = JSON.parse(localStorage.getItem('user')).token;
        try {
            const response = await fetch('http://localhost:8888/user', {
                method: "POST", // or 'PUT'
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${existingToken}`
                },
                body: JSON.stringify(data),
            });

            if (response.status === 201) {
                console.log('Creation of account was successful!');

                toast.success('Creation of account was successful!', { 
                    duration: 750,
                    className: 'register-success-toast'
                 });
                await new Promise((resolve) => setTimeout(resolve, 750)); //* Purely to show animations only; wait a while to show animations

                const redirectPromise = navigate('/dashboard/user', { replace: true });
                toast.promise(redirectPromise, {
                    loading: 'Redirecting...',
                    success: 'Login success!',
                    error: 'Error when fetching'
                },
                    {
                        loading: {
                            duration: 1000,
                        },
                        success: {
                            duration: 1000,
                        },
                        error: {
                            duration: 1000,
                        },
                    })
            } else {
                console.log("Creation of account failed!");
                toast.error('Creation of account failed!', { duration: 2000 });
            }


        } catch (error) {
            console.error("Error:", error);
        }
    };

    const getCreatorRoleLevel = async () => {
        try {
            const response = await Authentication.authenticate();
            return response.roleLevel
        } catch(err) {
            console.log('Token is invalid in getting creator role level!')
            return 0
        }
    }

    
    useEffect(() => {
        getCreatorRoleLevel().then((resolvedRoleLevel) => {
            setCreatorRoleLevel(resolvedRoleLevel);
        })
    }, [])

    return (
        <>

            <Stack spacing={3}>
                <TextField
                    name="username"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)} />

                <TextField
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <TextField
                    select
                    className="roleLevel"
                    label="Role Level"
                    value={roleLevel}
                    onChange={(e) => setRoleLevel(e.target.value)}
                    fullWidth
                    margin="normal">
                    {creatorRoleLevel >= 1 && <MenuItem value="0">Staff</MenuItem>}
                    {creatorRoleLevel >= 2 && <MenuItem value="1">Branch Manager</MenuItem>}
                    {creatorRoleLevel === 3 && <MenuItem value="2">Administrator</MenuItem>}
                </TextField>

                <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleClick} id='register-button'>
                    Register
                </LoadingButton>
            </Stack >

        </>
    );
}
