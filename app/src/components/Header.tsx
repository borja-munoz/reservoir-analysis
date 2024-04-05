import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { Box, FormControl, Typography } from "@mui/material";
import FlareOutlinedIcon from "@mui/icons-material/FlareOutlined";

import { LOCALES } from "../i18n/locales";
import { FormattedMessage, useIntl } from "react-intl";
import { RootState } from "../store/store";
import { setLocale } from "../store/appSlice";

// Languages
const languages = [
  { name: "English", code: LOCALES.ENGLISH },
  { name: "Spanish", code: LOCALES.SPANISH },
];

export default function Header() {
  const dispatch = useDispatch();
  const locale = useSelector((state: RootState) => state.app.locale);
  const [language, setLanguage] = useState(locale);
  const intl = useIntl();

  const handleChange = (
    event: SelectChangeEvent<string>,
    child: React.ReactNode
  ) => {
    setLanguage(event.target.value);
    dispatch(setLocale(event.target.value));
  };

  return (
    <Grid
      container
      spacing={1}
      mt={1}
      ml={1}
      sx={{ minHeight: "50px", maxHeight: "100px", marginBottom: "10px" }}
    >
      <Grid item xs={8}>
        <FlareOutlinedIcon color="primary" sx={{ mr: 2 }} fontSize="large" />
        <Typography color="primary" alignItems="top" component="span" variant="h5">Reservoir Analysis</Typography>
      </Grid>
      <Grid item xs={4}>
        <Box display="flex" justifyContent="flex-end" mr={4}>
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
      </Grid>
    </Grid>
  );
}
