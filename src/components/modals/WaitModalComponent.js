import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import Backdrop from '@material-ui/core/Backdrop';

export default function WaitModalComponent(props) {
   
    return (
            <Dialog open={props.loading}>
                <CircularProgress/>
            </Dialog>
    );
    
}

