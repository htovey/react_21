import React, { Component, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import CustomTextField from '../../custom/CustomTextField';
import Button from '@material-ui/core/Button';
import '../../../styles/App.css';
import { MenuItem, FormControl } from '@material-ui/core';
import Select from '@material-ui/core/Select';
import { withStyles } from '@material-ui/styles';
import { BIZTYPES } from '../../../constants/BizTypes';

export default class BizFormDialog extends Component {

  constructor(props) {
    super(props);
    this.state={
      error: '',
      bizNameInput: '',
      bizTypeInput: '',
      placeHolder: '',
      bizTypeList: this.buildBizTypeList(),
    }
  } 

  buildBizTypeList = () => {
    let bizTypeList = BIZTYPES.map(function(bizType, i) {
      if (bizType.value === '') {
      return <MenuItem classes={{"root": "disabledItem"}} disabled key={bizType.value} value={bizType.value}>{bizType.label}</MenuItem>
      }
       return <MenuItem key={bizType.value} value={bizType.value}>{bizType.label}</MenuItem>
    });
    return bizTypeList;
  }

  showBizForm = () => {
    if (this.props.actionType === "update" || this.props.showBizForm) {
      return true;
    }
    return false;
  }

  getBizNameValue = () => {
    if (this.props.actionType === "update") {
      this.setState({bizModel: { userName : this.props.globalLoginModel.userName}});
    }
  }

  getBizTypeValue = () => {
    let val = '';
    let stateBizType = this.state.bizTypeInput;
    let modelBizType = this.props.bizModel.bizType;
    if(stateBizType !== '') {
      val = stateBizType;
    } else if (modelBizType) {
      val = modelBizType;
    }
    return val;
  }

  handleSelect = (e) => {
    this.setState({ bizTypeInput: e.target.value });   
  }

  handleSubmitBiz = (e) => {
    e.preventDefault();
    var biz = this.updateBizModel();
    if (this.validBiz(biz)) {
      this.props.handleBizSubmit(biz, e);  
    }
  }

  handleCancel = () => {
    console.log('handleCancel');
    this.props.handleClose();
  }

  handleError = (message) => {
    this.setState({error: message});
  }

  updateBizModel = () => {
    var bizModel = this.props.bizModel;

    if (this.state.bizNameInput) {
      bizModel.name = this.state.bizNameInput;
    }

    if (this.state.bizTypeInput) {
      bizModel.bizType = this.state.bizTypeInput;
    }  

    return bizModel;
  }

  validBiz = (biz) => {
    if (!biz.name || !biz.bizType) {
        this.handleError('Please fill out all fields.');
    } else {
        //make sure any previous error is cleared
        this.setState({error: ''});
        return true;
    }
  }
  
  render () {
    const StyledContent = withStyles({root: {color : 'red'}})(DialogContentText);
    return (
     
        <Dialog 
          open={this.props.openBizForm}
          maxWidth="md"
          aria-labelledby="form-dialog-title">
          <DialogContent className={"bizDialog"}>
            <StyledContent>
              {this.state.error}
            </StyledContent>             
            <CustomTextField
              name="name"
              required
              defaultValue={this.getBizNameValue}
              onChange={(e) => this.setState({bizNameInput: e.target.value})}
              label="Business Name"
            />        
            <Select
              value={this.getBizTypeValue()}
              displayEmpty
              onChange={ (e) => this.handleSelect(e) }
              name="type"
              //className={this.getCategoryStyleClass()}
              variant="outlined"
              margin="dense"
              required
              fullWidth
            >
              {this.state.bizTypeList}
            </Select> 
            </DialogContent> 
          <DialogActions>
            <Button 
              onClick={this.handleSubmitBiz} 
              children={"Save"}
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