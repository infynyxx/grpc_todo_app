import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const Alert: React.FC<AlertProps> = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface AlertSnackBarProps {
  errorMessage?: string
}

export const AlertSnackBar: React.FC<AlertProps & AlertSnackBarProps> = (props) => {
  const { errorMessage } = props;
  return (
    <Snackbar open={errorMessage !== undefined} autoHideDuration={6000}>
      <Alert severity="error">
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}
