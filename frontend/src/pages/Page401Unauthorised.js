import { Helmet } from 'react-helmet-async';

import { Link } from 'react-router-dom';
// @mui
import { styled } from '@mui/material/styles';
import { Button, Typography, Container } from '@mui/material';

// ----------------------------------------------------------------------

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

export default function Page401() {
  return (
    <>
      <Helmet>
        <title>Unauthorised</title>
      </Helmet>

      <Container>
        <StyledContent sx={{ textAlign: 'center', alignItems: 'center' }}>
          <Typography variant="h3" paragraph>
            Sorry, page is protected!
          </Typography>

          <Typography sx={{ color: 'text.secondary', marginBottom: 4 }}>
            Sorry, this page requires authentication. Please login to access this page!
          </Typography>


          <Button to="/login" size="large" variant="contained" component={Link}>
            Go to Login
          </Button>
        </StyledContent>
      </Container >
    </>
  );
}
