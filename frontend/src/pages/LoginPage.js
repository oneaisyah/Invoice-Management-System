import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import { styled } from '@mui/material/styles';
import { Link, Container, Typography, Divider, Stack, Button } from '@mui/material';
// hooks
import useResponsive from '../hooks/useResponsive';
// components
import Iconify from '../components/iconify';
// sections
import { LoginForm } from '../sections/auth/login';


// ----------------------------------------------------------------------

const StyledRoot = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

const StyledSection = styled('div')(({ theme }) => ({
  width: '100%',
  maxWidth: 480,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  boxShadow: theme.customShadows.card,
  backgroundColor: theme.palette.background.default,
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

export default function LoginPage() {
  const mdUp = useResponsive('up', 'md');

  const [isImageLoaded, setIsImageLoaded] = useState(false); // State variable to track image loading
  useEffect(() => {
    const image = new Image();
    image.src = '/assets/illustrations/illustration_login.png';
    image.onload = () => {
      setIsImageLoaded(true);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title> Login </title>
      </Helmet>
      {isImageLoaded ? (<StyledRoot>

        {mdUp && (
          <StyledSection>
            <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
              Hi, Welcome Back!
            </Typography>
            <img src="/assets/illustrations/illustration_login.png" alt="login" />
          </StyledSection>
        )}

        <Container maxWidth="sm">
          <StyledContent>

            <Typography variant="h4" gutterBottom>
              Sign in to [redacted]!
            </Typography>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Log in
              </Typography>
            </Divider>

            <LoginForm />
          </StyledContent >
        </Container >
      </StyledRoot >) : (
      <div>Loading...</div>)}
      
    </>
  );
}
