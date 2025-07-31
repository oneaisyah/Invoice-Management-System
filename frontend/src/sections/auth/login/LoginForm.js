
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { Link, Stack, IconButton, InputAdornment, TextField, Checkbox, FormControlLabel } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import useRememberMe from '../../../hooks/useSavedFields';
import { useLogin } from '../../../hooks/useLogin';
import Iconify from '../../../components/iconify';
// ----------------------------------------------------------------------

export default function LoginForm() {

  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const { login, error, isLoading } = useLogin();
  const { updateRememberMe } = useRememberMe();

  const navigate = useNavigate();

  const checkIfLoggedIn = async () => {

    let existingToken = null
    if (localStorage.getItem('user')) {
      existingToken = JSON.parse(localStorage.getItem('user')).token;

      const response = await fetch('http://localhost:8888/authenticate/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${existingToken}`
        },
        body: JSON.stringify({ token: existingToken })
      });

      if (response.status === 201) {
        navigate("/dashboard/app");
      }
      console.log(response);
    }
  }
  useEffect(() => {
    checkIfLoggedIn();
    const isCheckboxChecked = (localStorage.getItem('rememberMeLogin') === 'true');
    if (isCheckboxChecked) {
      const storedUsername = localStorage.getItem('usernameField');
      const storedPassword = localStorage.getItem('passwordField');
      setIsChecked(true);
      setUsername(storedUsername || ''); // Use storedUsername as initial value
      setPassword(storedPassword || ''); // Use storedPassword as initial value
    }
  }, []);
  useEffect(() => {
    saveUsernameAndPassword();
  }, [username, password, isChecked]); // Run the effect whenever `username` changes

  const saveUsernameAndPassword = (e) => {
    const isCheckboxChecked = (localStorage.getItem('rememberMeLogin') === 'true');
    if (isCheckboxChecked) {
      const rememberMe = (localStorage.getItem('rememberMeLogin') === 'true');
      updateRememberMe(username, password, rememberMe);
    };
  }
  const handleCheckboxClick = async (e) => {
    e.preventDefault();
    const currentStatus = isChecked //* This is actually redundant; i put this here for clarity of what is going on
    setIsChecked(!currentStatus); //* visual update
    localStorage.setItem('rememberMeLogin', !currentStatus); //* local storage update
    if (currentStatus) { //* If the newly checked is evaluated to false, erase all local storage
      updateRememberMe('', '', false);
    } else {
      saveUsernameAndPassword()
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (await login(username, password)) {
        navigate('/dashboard/app');
      };
    } catch (error) {
      console.log('Error logging in', error)
    }

  };
  return (
    <>
      <Stack spacing={3}>
        <TextField
          name="username"
          label="Username"
          value={username}
          onChange={(e) => { setUsername(e.target.value) }}
        />

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
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>

        <FormControlLabel
          control={
            <Checkbox
              name="rememberMeLogin"
              checked={isChecked}
              onChange={handleCheckboxClick}
            />
          }
          label="Remember me"
        />

        <Link href="/login" variant="subtitle2" underline="hover">
          Forgot password?
        </Link>

      </Stack>

      <LoadingButton fullWidth size="large" type="submit" variant="contained" onClick={handleLogin} disabled={isLoading} >
        Login
      </LoadingButton>
    </>
  );
}