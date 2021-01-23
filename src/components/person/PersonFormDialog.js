import React, { Component, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CustomTextField from '../custom/CustomTextField';
import Button from '@material-ui/core/Button';
import '../../styles/App.css';
import { withStyles } from '@material-ui/styles';
import { MenuItem, FormControl } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { CATEGORIES } from '../../constants/Categories'
import WaitModalComponent from '../modals/WaitModalComponent';

export default class PersonFormDialog extends Component {

  constructor(props) {
    super(props);
    this.state={
      error: '',
      userNameInput: '',
      firstNameInput: '',
      lastNameInput: '',
      passwordInput: '',
      placeHolder: '',
      loginModel: {
        userName: '',
        password: ''
      }
    }
   } 

  showProfile = () => {
    if (this.props.actionType === "update" || this.props.showProfile) {
      return true;
    }
    return false;
  }

  getUserNameValue = () => {
    if (this.props.actionType === "update") {
      this.setState({loginModel: { userName : this.props.globalLoginModel.userName}});
    }
  }

  getPasswordValue = () => {
    if (this.props.actionType === "update") {
      this.setState({loginModel: { password: this.props.globalLoginModel.password}});
    }
  }

  handlePersonFormSubmit = (e) => {
   if (!this.props.showProfile) {
      this.handleSubmitUser(e);
   } else if (this.props.showProfile && this.props.actionType === "update") {
     this.handleSubmitUser(e);
     this.handleSubmitPerson(e);
   } else {
     this.handleSubmitPerson(e);
   }
  }

  handleSubmitPerson = (e) => {
    e.preventDefault();
    var person = this.updatePersonModel();
    if (this.validPerson(person)) {
      this.props.handlePersonSubmit(person, e);  
    }
  }

  handleSubmitUser = (e) => {
    e.preventDefault();
    var user = this.updateLoginModel();
    if (this.validUser(user)) {
      this.props.handleUserSubmit(user, e);
    }
  }

  handleCancel = () => {
    console.log('handleCancel');
    this.props.handleClose();
  }

  handleError = (message) => {
    this.setState({error: message});
  }

  updateLoginModel = () => {
    var loginModel = this.state.loginModel;

    if (this.state.userNameInput) {
      loginModel.userName = this.state.userNameInput;
    }

    if (this.state.passwordInput) {
      loginModel.password = this.state.passwordInput;
    }  

    return loginModel;
  }

  updatePersonModel = () => {
    var personModel = this.props.personModel;
    var user = this.state.loginModel.userName;
  
    if (user) {
      personModel.userName = user;
      personModel.adminId = this.props.adminId;

      if (this.state.firstNameInput) {
        personModel.fName = this.state.firstNameInput;
      }

      if (this.state.lastNameInput) {
        personModel.lName = this.state.lastNameInput;
      }  

      return personModel;
    } else {
      this.handleError("Error: can't create profile without username.");
    }
  }

  validPerson = (person) => {
    if (!person.fName || !person.lName ) {
        this.handleError('Please fill out all fields.');
    } else {
        //make sure any previous error is cleared
        this.setState({error: ''});
        return true;
    }
  }

  validUser = (user) => {
    if (!user.userName || !user.password) {
      this.handleError('Please fill out all fields.');
    } else {
      this.setState({error: ''});
      return true;
    }
  }
  
  render () {
    const StyledContent = withStyles({root: {color : 'red'}})(DialogContentText);
    return (
     
        <Dialog 
          open={this.props.openPerson}
          maxWidth="md"
          aria-labelledby="form-dialog-title">
          {this.props.showLogin &&
          <DialogContent className={"personDialog"}>
            <StyledContent>
              {this.props.error}
            </StyledContent>             
            <CustomTextField
              name="userName"
              required
              defaultValue={this.getUserNameValue}
              onChange={(e) => this.setState({userNameInput: e.target.value})}
              label="User Id"
            />        
            <CustomTextField
              name="password"
              required
              defaultValue={this.state.loginModel.password || ''}
              onChange={(e) => this.setState({passwordInput: e.target.value})}
              label="Password"
            /> 
            </DialogContent> }
            { this.showProfile() &&
            <DialogContent>
             <CustomTextField
              name="firstName"
              required
              defaultValue={this.props.personModel.fName || ''}
              onChange={(e) => this.setState({firstNameInput: e.target.value})}
              label="First Name"
            />
            <CustomTextField
              name="lastName"
              required
              defaultValue={this.props.personModel.lName || ''}
              onChange={(e) => this.setState({lastNameInput: e.target.value})}
              label="Last Name"
            />
         
          </DialogContent>}
          <DialogActions>
            <Button 
              onClick={this.handlePersonFormSubmit} 
              children={this.props.showProfile ? "Save" : "Next"} 
              color="primary">
                
            </Button>
            <Button onClick={this.handleCancel}>
                Cancel
            </Button>
          </DialogActions>
        </Dialog>
       
    );
    }
  }