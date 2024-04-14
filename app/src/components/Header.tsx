import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation } from 'react-router-dom';

import { AppBar, Container, Divider, Grid, Tab, Tabs, Toolbar } from '@mui/material';
import { styled } from '@mui/material/styles';
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, FormControl, Typography } from "@mui/material";
import FlareOutlinedIcon from "@mui/icons-material/FlareOutlined";

import { ROUTE_PATHS } from '../routes';
import { LOCALES } from "../i18n/locales";
import { FormattedMessage, useIntl } from "react-intl";
import { RootState } from "../store/store";
import { setLocale } from "../store/appSlice";

// Languages
const languages = [
  { name: "English", code: LOCALES.ENGLISH },
  { name: "Spanish", code: LOCALES.SPANISH },
];

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: 'transparent',
  boxShadow: 'none'
}));

const NavTabs = styled(Grid)(({ theme }) => ({
  flexDirection: 'row',
  alignContent: 'flex-start',
  paddingLeft: '10px',

  '& .MuiTab-root': {
    color: theme.palette.primary.main,

    '&:hover': {
      borderBottomColor: theme.palette.secondary.main,
    },
  },
  '& .MuiTabs-indicator': {
    backgroundColor: theme.palette.primary.main,
  },
}));

const VerticalNavTabs = styled(Grid)(({ theme }) => ({
  flexDirection: 'column',

  '& .MuiTabs-root': {
    boxShadow: 'none',
  },
  '& .MuiTabs-vertical .MuiTab-root': {
    justifyContent: 'flex-start',
    paddingLeft: theme.spacing(2),
  },
}));

export default function Header() {
  const dispatch = useDispatch();
  const locale = useSelector((state: RootState) => state.app.locale);
  const [language, setLanguage] = useState(locale);
  const intl = useIntl();
  const location = useLocation();
  const pathname = location.pathname.split('/')[1] || false;
  const vertical = false;

  const WrapperTabs = ({
    vertical = false,
    children,
  }: {
    vertical?: boolean;
    children: React.ReactNode;
  }) =>
    vertical ? (
      <VerticalNavTabs container>{children}</VerticalNavTabs>
    ) : (
      <NavTabs container sx={{width: '50%'}}>{children}</NavTabs>
    );

  const handleChange = (
    event: SelectChangeEvent<string>,
    _child: React.ReactNode
  ) => {
    setLanguage(event.target.value);
    dispatch(setLocale(event.target.value));
  };

  return (
    <StyledAppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <FlareOutlinedIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 2 }} />
          <Typography
            variant="h6"
            noWrap
            component="span"
            sx={{
              minWidth: '275px',
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            SAIH Explorer
          </Typography>
          <Divider orientation='vertical' flexItem sx={{marginTop: '5px'}} />
          <WrapperTabs vertical={vertical}>
            <Tabs
              value={pathname ? pathname : ''}
              textColor={vertical ? 'primary' : 'inherit'}
              orientation={vertical ? 'vertical' : 'horizontal'}
            >
              <Tab
                label={<FormattedMessage id="home" />}
                value=''
                component={NavLink as any}
                to={ROUTE_PATHS.DEFAULT}
              />
              <Tab
                label={<FormattedMessage id="dashboard" />}
                value='dashboard'
                component={NavLink as any}
                to={ROUTE_PATHS.DASHBOARD}
              />
            </Tabs>
          </WrapperTabs>        
          <Box display="flex" justifyContent="flex-end">
            <FormControl size="small">
              <InputLabel id="language-label">
                <FormattedMessage id="language" />
              </InputLabel>
              <Select
                labelId="language-label"
                label={intl.formatMessage({ id: "language" })}
                value={language}
                onChange={handleChange}
              >
                {languages.map(({ name, code }) => (
                  <MenuItem key={code} value={code}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Toolbar>
      </Container>
    </StyledAppBar>
  );
}
