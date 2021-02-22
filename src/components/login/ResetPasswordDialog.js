import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import '../../styles/App.css';
import { withStyles } from '@material-ui/styles';
import CustomTextField from '../custom/CustomTextField';

export default function ResetPasswordDialog(props) {

   let unameRef = '';
   let pwRef = '';

  const handleEnterKey = (e) => {
    if(e.key === "Enter"){
        if(props.showPassword) {
            handleResetSubmit(e);
        } else {
            handleUserLookup(e);
        }
    }
  }

  const handleUserLookup = (e) => {
    props.handleResetUserLookup(unameRef.value, e);
  }

  const handleResetSubmit = (e) => {
    props.handleResetPassword(unameRef.value, pwRef.value, e);
  }

  const StyledContent = withStyles({root: {color : 'red'}})(DialogContentText);

  return (
    
      <Dialog 
        className={"noteClass"}
        open={props.openResetForm} 
        aria-labelledby="form-dialog-title" 
        onKeyPress={(e) => handleEnterKey(e)} >
        <DialogContent>
          <StyledContent>
            {props.error}
          </StyledContent>
          
          {!props.showPassword && <CustomTextField
            autoFocus
            name="username"
            required
            inputRef={el => unameRef = el}
            label="User Id"
          />}
            {props.showPassword && <CustomTextField
            name="password"
            required
            inputRef={el => pwRef = el} 
            label={"Reset Password for user "+props.resetLoginModel.username} 
          />}       
        </DialogContent>
        <DialogActions>
            {props.showPassword && <Button 
                onClick={handleResetSubmit} 
                color="primary">
                Reset
            </Button>}
            {!props.showPassword && <Button
                onClick={handleUserLookup}
            >
            Request Reset
            </Button>}
        </DialogActions>
      </Dialog>
      
  );
}