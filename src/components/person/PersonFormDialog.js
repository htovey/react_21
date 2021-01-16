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
      userNameInput: '',
      firstNameInput: '',
      lastNameInput: '',
      placeHolder: ''
    }
   } 

  // getFnameValue = () => { 
  //   let val = '';
  //   let stateFname = this.state.firstNameInput;
  //   let modelFname = this.props.personModel.fName;
  //   if(stateFname !== '') {
  //     //always use state value if it has been set
  //     val = stateFname;
  //   } else if (modelFname) {
  //     //use model value when editing existing person, where state has not been set
  //     val = modelFname;
  //   }
  //   //return default empty value if neither state nor model has been set 
  //   console.log('set fname val to: '+val);
  //   return val;
  // }

  // getCategoryStyleClass = () => {
  //   if (this.state.categoryInput === '' && !this.props.personModel.category) {
  //     return "disabledItem";
  //   } else {
  //     return "selectedItem";
  //   }
  // }
 
  handleSubmit = (e) => {
      e.preventDefault();
      var person = this.updatePersonModel();
      this.props.handlePersonValSubmit(person, e);  
  }

  // handleSelect = (e) => {
  //   this.setState({ categoryInput: e.target.value });   
  // }

  handleCancel = () => {
    console.log('handleCancel');
    return this.props.handleClose;
  }

  updatePersonModel = () => {
    var personModel = this.props.personModel;

    if (this.state.userNameInput) {
      personModel.userName = this.state.userNameInput;
    }

    if (this.state.firstNameInput) {
      personModel.fName = this.state.firstNameInput;
    }

    if (this.state.lastNameInput) {
      personModel.lName = this.state.lastNameInput;
    }  

    return personModel;
  }
  
  render () {
    const StyledContent = withStyles({root: {color : 'red'}})(DialogContentText);
    return (
     
        <Dialog 
          open={this.props.openPerson}
          maxWidth="md"
          aria-labelledby="form-dialog-title">
          <DialogContent className={"personDialog"}>
            <StyledContent>
              {this.props.error}
            </StyledContent>  
            <CustomTextField
              name="userName"
              required
              defaultValue={this.props.personModel.userName || ''}
              onChange={(e) => this.setState({userNameInput: e.target.value})}
              label="User Id"
            />          
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
         
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleSubmit} color="primary">
                Save
            </Button>
            <Button onClick={this.handleCancel}>
                Cancel
            </Button>
          </DialogActions>
        </Dialog>
       
    );
    }
  }