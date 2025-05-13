import {
  Avatar,
  Box,
  Button,
  Divider,
  Menu,
  Stack,
  Typography,
} from '@mui/material';
import ProfileImage from 'assets/avatar.jpeg';
import IconifyIcon from 'components/base/IconifyIcon';
import { MouseEvent, useState, useEffect } from 'react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
interface User {
  username: string;
  contact: string;
  email: string;
}
const profileData = [
  {
    href: '/profile', // Change to the appropriate path
    title: 'My Profile',
    subtitle: 'Account Settings',
    icon: 'fa:user-circle-o',
    color: 'primary.light',
  },
];
const ProfileDropdown = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const userInfo = localStorage.getItem('user_info');
    if (userInfo) {
      setUser(JSON.parse(userInfo)); // Parse JSON string into object
    }
  }, []);
  const handleOpenDropdown = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
    navigate('/'); 
  };
  return (
    <Fragment>
      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: 280,
            bgcolor: 'common.white',
          },
        }}
      >
        <Box p={3}>
          <Typography variant="subtitle1" color="text.primary">
            User Profile
          </Typography>
          <Stack direction="row" py={2.5} spacing={1.5} alignItems="center">
            <Avatar src={ProfileImage} alt="Profile Image" sx={{ width: 65, height: 65 }} />
            <Box>
              <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                {user?.username || 'Loading...'}
              </Typography>
              <Typography variant="caption" color="textSecondary">
                {user?.contact || 'Contact'}
              </Typography>
              <Typography
                variant="subtitle2"
                color="textSecondary"
                display="flex"
                alignItems="center"
                gap={0.5}
              >
                <IconifyIcon icon="majesticons:mail-line" />
                {user?.email || 'Email'}
              </Typography>
            </Box>
          </Stack>
          <Divider />
          <Box mt={1.25}>
            <Button onClick={handleClose} variant="outlined" color="error" fullWidth>
              Logout
            </Button>
          </Box>
        </Box>
      </Menu>
    </Fragment>
  );
};
export default ProfileDropdown;
