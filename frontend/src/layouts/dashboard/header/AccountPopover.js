import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

// @mui
import { alpha } from '@mui/material/styles';
import { Box, Divider, Typography, Stack, MenuItem, Avatar, IconButton, Popover } from '@mui/material';

import { useLogout } from '../../../hooks/useLogout';

// mocks_
import account from '../../../_mock/account';

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
  {
    label: 'Home',
    icon: 'eva:home-fill',
    action: 'home'
  },
  {
    label: 'Profile',
    icon: 'eva:person-fill',
    action: 'profile'
  },
  {
    label: 'Settings',
    icon: 'eva:settings-2-fill',
    action: 'settings'
  },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
  const [open, setOpen] = useState(null);
  const [displayName, setDisplayName] = useState('')
  const [roleLevel, setRoleLevel] = useState('')
  const [photoURL, setPhotoURL] = useState('')
  /*
  const [roleLevelDisplay, setRoleLevelDisplay] = useState(0);
  useEffect(() => {
    if (localStorage.getItem('user')) {
      setRoleLevelDisplay(JSON.parse(localStorage.getItem('user')).roleLevel);
    }

  }, [localStorage]) */

  const { logout } = useLogout()

  const navigate = useNavigate();

  const handleMenuOpen = (event) => {
    setOpen(event.currentTarget); //* Open the menu tab
  };
  const handleMenuClose = (action) => {
    switch (action) {
      case 'home':
        // Action for Home menu item
        console.log('Home menu item clicked');
        setOpen(null); //* Close the menu tab
        break;
      case 'profile':
        // Action for Profile menu item
        console.log('Profile menu item clicked');
        setOpen(null); //* Close the menu tab
        break;
      case 'settings':
        // Action for Settings menu item
        console.log('Settings menu item clicked');
        setOpen(null); //* Close the menu tab
        break;
      default:
        // Default action if no matching 'action' is found
        console.log('Unknown menu item clicked');
        setOpen(null); //* Close the menu tab
        break;
    }
  }
  
  const handleLogout = async () => {

    await logout();
    await navigate('/login');
    toast.success('Logout success!', { duration: 1000 });
  };
  
  useEffect(() => {
    const {displayName, roleLevel, photoURL} = account()
    setDisplayName(displayName);
    setRoleLevel(roleLevel);
    setPhotoURL(photoURL);
  },[])
  return (
    <>
      <IconButton
        onClick={handleMenuOpen}
        sx={{
          p: 0,
          ...(open && {
            '&:before': {
              zIndex: 1,
              content: "''",
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              position: 'absolute',
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={photoURL} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 180,
            '& .MuiMenuItem-root': {
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ my: 1.5, px: 2.5 }}>
          <Typography variant="subtitle2" noWrap>
            {displayName}
          </Typography>

          <Typography variant="body2" sx={{ color: 'text.secondary' }} noWrap>
            {roleLevel}
          </Typography>
        </Box >

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Stack sx={{ p: 1 }}>
          {MENU_OPTIONS.map((option) => (
            <MenuItem key={option.label} onClick={() => handleMenuClose(option.action)}>
              {option.label}
            </MenuItem>
          ))}
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <MenuItem onClick={handleLogout} sx={{ m: 1 }}>
          Logout
        </MenuItem>
      </Popover >
    </>
  );
}
