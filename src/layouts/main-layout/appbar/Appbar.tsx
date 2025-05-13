import { AppBar, Box, IconButton, Link, Stack, Toolbar, Typography } from '@mui/material';
import IconifyIcon from 'components/base/IconifyIcon';
import Image from 'components/base/Image';
import ProfileDropdown from 'layouts/main-layout/appbar/ProfileDropdown';
import SearchInput from 'layouts/main-layout/appbar/SearchInput';
import { MouseEvent, useState } from 'react';
import { useLocation } from 'react-router-dom';
interface NavbarProps {
  onDrawerToggle: () => void;
}
const MainNavbar = ({ onDrawerToggle }: NavbarProps) => {
  const [open, setOpen] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter((segment) => segment.trim() !== '');
  const routeName = pathSegments.length > 0 ? pathSegments.pop() : 'Overview';
  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setOpen(event.currentTarget);
  };
  const handleClose = () => {
    setOpen(null);
  };

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'common.white' }}>
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: { xs: 0, lg: 2 },
          }}
        >
          <Typography
            sx={{
              display: { xs: 'none', md: 'block' },
              fontSize: { sm: 'h2.fontSize', xl: 'h1.fontSize' },
              fontWeight: 600,
              color: 'primary.darker',
              flex: 1,
              textAlign: { xs: 'center', md: 'left' },
              textTransform: 'capitalize',
            }}
          >
            {routeName}
          </Typography>
          <Stack direction="row" gap={1} sx={{ display: { xs: 'flex', md: 'none' } }}>
            <Link href="/" sx={{ display: 'flex', p: 0.5 }}>
              <Image src="/bankdash/bankdash.svg" alt="Logo" sx={{ width: 25 }} />
            </Link>
            <IconButton onClick={onDrawerToggle} sx={{ display: { md: 'none' } }}>
              <IconifyIcon icon="mingcute:menu-line" color="primary.darker" width={25} />
            </IconButton>
          </Stack>

          <Stack direction="row" sx={{ alignItems: 'center', gap: { xs: 2.5, xl: 3.75 } }}>
            <ProfileDropdown />
          </Stack>
        </Toolbar>
        <Box sx={{ display: { xs: 'block', md: 'none' }, px: 3.15, mt: 2.5 }}>
          <SearchInput fullWidth={true} size={'small'} />
        </Box>
      </AppBar>
    </>
  );
};

export default MainNavbar;
