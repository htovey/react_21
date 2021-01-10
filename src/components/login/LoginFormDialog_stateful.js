import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MuiThemeProvider from 'material-ui/styles';
import Button from '@material-ui/core/Button';
import '../../styles/App.css';
import { withStyles } from '@material-ui/styles';
import CustomTextField from '../custom/CustomTextField';

export default class LoginFormDialog extends Component {

  constructor(props) {
    const unameRef = '';
    const pwRef = '';
    super(props);
    // this.state={
    //    loginModel: {
    //      username: '',
    //      password: ''
    //    }
    // }
   }

  // componentDidUpdate(prevProps, prevState, snapshot) {
  //   if (prevProps.error !== this.props.error) {
  //      this.setState({
  //        loginModel: {
  //          username: '',
  //          password: ''
  //        }
  //      });
  //   }
  // }

  handleEnterKey = (e) => {
    if(e.key === "Enter") {
      this.handleSubmit(e);
    }
  }

  handleLoginSubmit = (e) => {
    e.preventDefault();   
    //this.props.handleLogin(this.state.loginModel, e);
    this.props.handleLogin(this.unameRef.value, this.pwRef.value, e);
  }
  
  render () {
    const StyledContent = withStyles({root: {color : 'red'}})(DialogContentText);

    return (
     
        <Dialog open={this.props.openLogin} onClose={this.handleClose} aria-labelledby="form-dialog-title" onKeyPress={(e) => this.handleEnterKey(e)} >
          {/* <DialogTitle id="form-dialog-title">Login to Notes</DialogTitle> */}
          <DialogContent>
            <StyledContent>
              {this.props.error}
            </StyledContent>
            
            <CustomTextField
              autoFocus
              name="username"
              required
              //value={this.state.loginModel.username}
              // onChange={(e) => this.setState({
              //   loginModel: {
              //     username: e.target.value, 
              //     password: this.state.loginModel.password ||''
              //   }})}
              inputRef={el => this.unameRef = el}
              label="User Id"
              fullWidth
              variant="outlined"
            />
             <CustomTextField
              name="password"
              required
              //value={this.state.loginModel.password}
              // onChange={(e) => this.setState({
              //   loginModel: {
              //     username: this.state.loginModel.username, 
              //     password :e.target.value
              //   }})}
              inputRef={el => this.pwRef = el} 
              label="Password"
              fullWidth
              variant="outlined"
            />
         
          </DialogContent>
          <DialogActions>
            <Button onClick={this.} color="primary">
              Login
            </Button>
          </DialogActions>
        </Dialog>
       
    );
    }
  }