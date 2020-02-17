import React, { useState } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

const Alert: React.FC<AlertProps> = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

interface AlertSnackBarProps {
  errorMessage: string | null
}

export const AlertSnackBar: React.FC<AlertProps & AlertSnackBarProps> = (props) => {
  const { errorMessage, onClose } = props;
  const [error, setError] = useState(errorMessage);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(null);
  };
  return (
    <Snackbar open={errorMessage !== null} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={onClose} severity="error">
        {error}
      </Alert>
    </Snackbar>
  );
}
