import React from 'react';

import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface AlertSnackBarProps {
  errorMessage?: string
}

export const AlertSnackBar: React.FC<AlertSnackBarProps> = (props) => {
  const { errorMessage } = props;
  return (
    <Snackbar open={errorMessage !== undefined} autoHideDuration={6000}>
      <Alert severity="error" variant="filled">
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}
