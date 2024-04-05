import { Outlet } from 'react-router-dom';
import Header from './Header';
import ModalMessage from './ModalMessage';
import Sidebar from './Sidebar';
import { Grid } from '@mui/material';

export default function DefaultView() {
  return (
    <>
      <Header />
      <Grid container>
        <Grid item xs={3}>
          <Sidebar />
        </Grid>
        <Grid item xs={9}>
          <Outlet />
        </Grid>
      </Grid>
      <ModalMessage />
    </>
  );
}