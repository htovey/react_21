import React from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Button from '@material-ui/core/Button';
import '../../styles/App.css';
import { withStyles } from '@material-ui/styles';
import CustomTextField from '../custom/CustomTextField';

export default function LoginFormDialog (props) {

   let unameRef = '';
   let pwRef = '';

  const handleEnterKey = (e) => {
    if(e.key === "Enter") {
      handleLoginSubmit(e);
    }
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();   
    props.handleLogin(unameRef.value, pwRef.value, e);
  }
  
    const StyledContent = withStyles({root: {color : 'red'}})(DialogContentText);

    return (
     
        <Dialog 
          className={"noteClass"}
          open={props.openLogin} 
          onClose={props.handleClose} 
          aria-labelledby="form-dialog-title" 
          onKeyPress={(e) => handleEnterKey(e)} >
          <DialogContent>
            <StyledContent>
              {props.error}
            </StyledContent>
            
            <CustomTextField
              autoFocus
              name="username"
              required
              inputRef={el => unameRef = el}
              label="User Id"
              defaultValue={"ht5"}
            />
             <CustomTextField
              name="password"
              required
              inputRef={el => pwRef = el} 
              label="Password"
              defaultValue="hockey"
            />
         
          </DialogContent>
          <DialogActions>
            <Button onClick={handleLoginSubmit} color="primary">
              Login
            </Button>
          </DialogActions>
        </Dialog>
       
    );
  }