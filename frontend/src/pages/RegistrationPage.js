import { Helmet } from 'react-helmet-async';


import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
import Authentication from '../components/apiWrapper/Authentication';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Iconify from '../components/iconify';
import RegistrationForm from '../sections/auth/registration/RegistrationForm';
// sections
// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledContent = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function RegistrationPage() {
  const mdUp = useResponsive('up', 'md');

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);


  const authenticateToken = async () => {
    try {
      const response = await Authentication.authenticate();
      if (response) {
        console.log("Authentication success!");
        navigate("/registration");

      } else {
        console.log("Authentication failed!");
        navigate("/401");
      }
    } catch (error) {
      console.error("Error while authenticating token:", error);
      navigate("/404");
    }
  }

  useEffect(() => {
    authenticateToken();
    setIsLoading(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title> Registration</title>
      </Helmet>

      <StyledRoot>

        <Container maxWidth="sm">
          <StyledContent>
            <Typography variant="h4" gutterBottom>
              Registration
            </Typography>


            <Divider sx={{ my: 3, marginTop: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Create Account
              </Typography>
            </Divider>

            <RegistrationForm />


          </StyledContent>
        </Container >
      </StyledRoot >
    </>
  );
}
