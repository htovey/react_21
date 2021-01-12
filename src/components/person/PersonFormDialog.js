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

export default class NoteFormDialog extends Component {

  constructor(props) {
    super(props);
    this.state={
      categoryInput: '',
      personTextInput: '',
      placeHolder: '',
      categoryList: this.buildCategoryList(),
    }
   }

  buildCategoryList = () => {
    let catList = CATEGORIES.map(function(category, i) {
      if (category.value === '') {
      return <MenuItem classes={{"root": "disabledItem"}} disabled key={category.value} value={category.value}>{category.label}</MenuItem>
      }
       return <MenuItem key={category.value} value={category.value}>{category.label}</MenuItem>
    });
    return catList;
  } 

  getCategoryValue = () => { 
    let val = '';
    let stateCat = this.state.categoryInput;
    let modelCat = this.props.personModel.category;
    if(stateCat !== '') {
      //always use state value if it has been set
      val = stateCat;
    } else if (modelCat) {
      //use model value when editing existing person, where state has not been set
      val = modelCat;
    }
    //return default empty value if neither state nor model has been set 
    console.log('set cat val to: '+val);
    return val;
  }

  getCategoryStyleClass = () => {
    if (this.state.categoryInput === '' && !this.props.personModel.category) {
      return "disabledItem";
    } else {
      return "selectedItem";
    }
  }
 
  handleSubmit = (e) => {
      e.preventDefault();
      var person = this.populateNoteModel();
      this.props.handleNoteValSubmit(person, e);  
  }

  handleSelect = (e) => {
    this.setState({ categoryInput: e.target.value });   
  }

  handleCancel = () => {
   // this.resetFormState();
    console.log('handleCancel');
    return this.props.handleClose();
  }

  populateNoteModel = () => {
    var personModel = this.props.personModel;
    
    if (this.state.categoryInput) {
      personModel.category = this.state.categoryInput;
    }

    if (this.state.personTextInput) {
      personModel.personText = this.state.personTextInput;
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
            <Select
              value={this.getCategoryValue()}
              displayEmpty
              onChange={ (e) => this.handleSelect(e) }
              name="category"
              className={this.getCategoryStyleClass()}
              variant="outlined"
              margin="dense"
              required
              fullWidth
            >
              {this.state.categoryList}
            </Select>    
             <CustomTextField
              name="personText"
              required
              defaultValue={this.props.personModel.personText || ''}
              onChange={(e) => this.setState({personTextInput: e.target.value})}
              label="Note"
              multiline
              rows="15"
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