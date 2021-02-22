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
import WaitModalComponent from '../modals/WaitModalComponent';

export default class PersonFormDialog extends Component {

  constructor(props) {
    super(props);
    this.state={
      error: '',
      userNameInput: '',
      firstNameInput: '',
      lastNameInput: '',
      roleInput: '',
      passwordInput: '',
      placeHolder: '',
      createLogin: true,
      // createProfile: false,
      roleList: this.buildRoleList(props.actionType)
    }
  } 

  buildRoleList = () => {
    let myRoleList = [];
    if (this.props.loginModel.roleName !== "Super") {
      myRoleList = [<MenuItem key={0} value={""}>Please Select a Role</MenuItem>];
      this.props.roleList.map(function(role, i) {
          myRoleList.push(<MenuItem key={i+1} value={role.id}>{role.name}</MenuItem>);
      });
    }
    return myRoleList;
  }

  getRoleValue = () => { 
    let val = '';
    let stateRole = this.state.roleInput;
    let modelRole = this.props.loginModel.roleName;
    if(stateRole !== '') {
      //always use state value if it has been set
      val = stateRole;
    } else if (modelRole) {
      //use model value when editing existing note, where state has not been set
      val = modelRole;
    }
    //return default empty value if neither state nor model has been set 
    console.log('set Role val to: '+val);
    return val;
  }

  handlePersonFormSubmit = (e) => {
    //todo do we want to always submit even if form values haven't changed?
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
      var person = this.populatePersonModel();
      if (this.validPerson(person)) {
        this.props.handlePersonSubmit(person, e);  
      }
  }

  handleSubmitUser = (e) => {
    e.preventDefault();
    var user = this.populateLoginModel();
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

  handleSelect = (e) => {
    this.setState({ roleInput: e.target.value });   
  }

  populateLoginModel = () => {
    var loginModel = this.props.loginModel;

    if (this.state.userNameInput !== "") {
      loginModel.userName = this.state.userNameInput;
    }

    if (this.state.passwordInput !== "") {
      loginModel.password = this.state.passwordInput;
    }  

    if (this.state.roleInput !== "") {
      loginModel.roleId = this.state.roleInput;
    }

    loginModel.bizId = this.props.bizId;

    return loginModel;
  }

  populatePersonModel = () => {
    var personModel = this.props.personModel;
    var user = this.props.loginModel.userName;
  
    if (user) {
      personModel.userName = user;
      personModel.adminId = this.props.adminId;

      if (this.state.firstNameInput !== "") {
        personModel.fName = this.state.firstNameInput;
      }

      if (this.state.lastNameInput !== "") {
        personModel.lName = this.state.lastNameInput;
      }  
      return personModel;
    } else {
      this.handleError("Error: can't populate profile without username.");
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
    if (!user.userName || (!user.password && this.props.actionType === "create")|| !user.roleId) {
      this.handleError('Please fill out all fields.');
    } else {
      this.setState({error: ''});
      return true;
    }
  }

  getRoleStyleClass = () => {
    if (this.state.roleId === '' && !this.props.loginModel.roleName) {
      return "disabledItem";
    } else {
      return "selectedItem";
    }
  }
  
  render () {
    const StyledContent = withStyles({root: {color : 'red'}})(DialogContentText);
    return (
     
        <Dialog 
          open={this.props.openPerson}
          maxWidth="md"
          aria-labelledby="form-dialog-title">
            {this.state.createLogin &&
          <DialogContent>
            <StyledContent>
              {this.props.error}
            </StyledContent>             
            <CustomTextField
              name="userName"
              required
              defaultValue={this.props.loginModel.userName || this.state.userNameInput || ''}
              onChange={(e) => this.setState({userNameInput: e.target.value})}
              label="User Id"
            />        
            {this.props.actionType === "create" && <CustomTextField
              name="password"
              required={this.props.actionType === "create"}
              onChange={(e) => this.setState({passwordInput: e.target.value})}
              label="Password"
            />} 
             <Select
              value={this.state.roleInput || this.props.loginModel.roleId}
              displayEmpty
              onChange={ (e) => this.handleSelect(e) }
              name="role"
              className={this.getRoleStyleClass()}
              variant="outlined"
              margin="dense"
              required
              fullWidth
            >
              {this.state.roleList}
            </Select> 
            </DialogContent>
             }
            { this.props.showProfile &&
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