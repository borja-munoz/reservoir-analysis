import { FormattedMessage, useIntl } from "react-intl";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function HomePage() {
  
  return(
    <Box maxWidth="xs" 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography variant="h2" color="primary">
        <FormattedMessage id="welcome" />
      </Typography>
    </Box>
  );
}
