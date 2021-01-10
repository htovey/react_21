import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

export default function CustomSnackBar (props) {
    const alertMessage = props.getAlertMsg();
    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            key={`${props.vertical}, ${props.horizontal}`}
            open={props.open}
            autoHideDuration={2000}
            onClose={props.handleClose}
        >
            <MuiAlert elevation={6} variant="filled" >
                {alertMessage}
            </MuiAlert>
        </Snackbar>
    );
}