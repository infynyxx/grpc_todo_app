import React from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const Alert: React.FC<AlertProps> = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface AlertSnackBarProps {
  errorMessage: string | null,
  onClose: ((event?: React.SyntheticEvent, reason?: string) => void)
}

export const AlertSnackBar: React.FC<AlertProps & AlertSnackBarProps> = (props) => {
  const { errorMessage, onClose } = props;
  return (
    <Snackbar open={errorMessage !== null} autoHideDuration={6000} onClose={onClose}>
      <Alert onClose={onClose} severity="error">
        {errorMessage}
      </Alert>
    </Snackbar>
  );
}
