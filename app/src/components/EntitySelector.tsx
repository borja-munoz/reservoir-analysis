import { styled } from '@mui/material/styles';
import { Box, Theme } from '@mui/material';
import { Drawer } from '@mui/material';
import { Link } from 'react-router-dom';

export const DRAWER_WIDTH = 250;

const NavDrawer = styled('nav')(({ theme }: { theme: Theme }) => ({
  flex: '0 0 auto',
  position: 'relative',
  width: DRAWER_WIDTH,
  flexShrink: 0,
}));

const DrawerDesktop = styled(Drawer)(() => ({
  '& .MuiPaper-root': {
    width: DRAWER_WIDTH,
    position: 'absolute',
    height: '100vh',
    padding: '20px',
    borderWidth: '0px',
  },
}));

export default function EntitySelector() {

  return (
    <NavDrawer>
      <DrawerDesktop variant='permanent' anchor='left' open>
          <Box mb={1}>
            <Link to="/">Home</Link>
          </Box>
          <Box>
            <Link to="/dashboard">Dashboard</Link>
          </Box>
      </DrawerDesktop>
    </NavDrawer>
  );
}