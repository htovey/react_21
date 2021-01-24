import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import '../../../styles/Dashboard.css';
import BizModel from '../../../models/BizModel';
import BizComponent from './BizComponent';
import BizListComponent from './BizListToolbarSelect'; 
import CustomSnackBar from '../../custom/CustomSnackBar';
import PersonComponent from '../../person/PersonComponent';
import FetchUtil from '../../../utils/FetchUtil';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    color: "navy",
    text: 32
  },
  paper: {
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));


class BizDashboardComponent extends Component {
  constructor(props) {
     super(props);
     this.state = {
        openBizForm: false,
        bizModel: {
            id: props.bizModel.id,
            name: props.bizModel.name,
            type: props.bizModel.type
        },
        personModel: {
          id: '',
          fName: '',
          lName: '',
          adminId: ''
        },
        loginModel: {
          userName: props.loginModel.userName,
          password: props.loginModel.password,
          roleType: props.loginModel.roleType || 'changeme'
        },
        bizList: [],
        roleList: [],
        actionType: '',
        snackBarOpen: false,
        openPerson: false,
        vertical: 'top',
        horizontal: 'center',
        loading: false
     }
  }
  
  editBiz = () => {
    this.toggleBiz("update");
  } 

  createPerson = (e) => {
    this.getRoleList(this.state.bizModel.type, e);
    this.togglePerson("create");
  }

  createBiz = () => {
    this.toggleBiz("create");
  }

  toggleBiz = (actiontype) => {
    console.log('biz dashboard - toggle biz');
    if(actiontype === "create") {
      this.setBizModel();
      this.setLoginModel();
    }

    // if (this.state.showBizList) {
    //   this.refreshBizList()
    // };
    this.setState({actionType: actiontype});
    this.setState({openBizForm: !this.state.openBizForm});
  }

  togglePerson = (toggleActionType) => {
    console.log('toggle biz person');
    if(toggleActionType === "create") {
      this.setLoginModel();
    }

    // if (this.state.showPersonList) {
    //   this.refreshPersonList()
    // };
    this.setState({actionType: toggleActionType});
    this.setState({openPerson: !this.state.openPerson});
  }

  setBizModel = (biz) => {
    if (biz) {
      this.setState({
        name: biz.name,
        type: biz.type
      });
    }
  }

  setLoginModel = () => {
    if (this.props.loginModel.roleType === 'SUPER') {
      this.setState({loginModel: this.props.loginModel});
    }
  }
  // getBizDataAndSetAction = (updateBizModel) => {
  //   if (updateBizModel) {
  //     console.log("updating biz model");
  //     this.setState({bizModel: {
  //       id: updateBizModel.id,
  //       name: updateBizModel.name,
  //       type: updateBizModel.type
  //     }, actionType: "update"});
  //   } else if (this.state.bizModel) {
  //     this.setState({actionType: "update"});
  //   } else {
  //     this.setState({actionType: "create"});
  //   }
  //   this.setState({openBizForm: true});
  // }

  getRoleList = (bizType, e) => {
    e.preventDefault();
    var params = {"bizType" : bizType};
    var url = "/roles";
    FetchUtil.handleGet(url, this.props.userToken, params)
    .then(response => response.json())
    .then(json => {
      this.setState({roleList: json});
    })
    .catch((error) => {
      console.log(error);
      this.handleError('get role list failed. Please try again.');
    }); 
  }

  handlePostSubmit = (url, payload, event) => {
    event.preventDefault();
    //build person payload
    var response = 'success';
    this.setState({loading: true});
    FetchUtil.handlePost(url, this.props.userToken, JSON.stringify(payload))
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                console.log("Success***");
                this.handleCRUDSuccess(this.state.actionType);
            }
        })    
        .catch((error) => {
            console.log(error);
            response = 'error';
            this.handleError('Save failed. Please try again.');
        }); 
        return response;
  }

  handleCRUDSuccess = (action) => {
    console.log("handleCRUDSuccess action:"+action);
    this.setState({
      openBizForm : false, 
      actionType: action
    });
    this.setState({snackBarOpen: true});
   // this.refreshPersonList();
  }

  getSnackbarMsg = () => {
    var action = 'created';
    if (this.state.actionType === 'update') {
      action = 'updated';
    } else if (this.state.actionType === 'delete') {
      action = 'deleted'
    }
    var msg = 'Success! Biz '+action+'.'
    return msg;
  }

  closeSnackBar = () => {
    this.setState({snackBarOpen: false});
  }

   render () {
      var classes = useStyles;
      return (
        <div className={classes.root}>
          <CustomSnackBar 
            open={this.state.snackBarOpen} 
            vertical={this.state.vertical} 
            horizontal={this.state.horizontal}
            getAlertMsg={this.getSnackbarMsg}
            handleClose={this.closeSnackBar}
          />
            <Grid >
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Card className={classes.paper}>
                      <Typography>{this.state.bizModel.name}</Typography>
                      <CardActions>
                        <Button onClick={this.editBiz}>Update Info</Button> 
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={2}>
                    <Card className={classes.paper}>
                      <Typography>
                        Admin Profiles
                      </Typography>
                      <CardActions>
                        <Button onClick={this.props.getBizList}>View Admin List</Button>
                        <Button onClick={this.createPerson}>Add Biz Admin</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
            </Grid>
            {this.state.openBizForm &&
                <BizComponent
                    userToken={this.props.userToken} 
                    adminId={this.props.adminId}
                    openBizForm={this.state.openBizForm}
                    handleSuccess={this.handleCRUDSuccess}
                    bizModel={this.state.bizModel}
                    loginModel={this.props.loginModel}
                    handleClose={this.toggleBiz}
                    actionType={this.state.actionType}
                    handleSubmit={this.handlePostSubmit}
                />
            }
            {this.openBizList &&
                <BizListComponent
                    handleSuccess={this.handleCRUDSuccess} 
                    userToken={this.props.userToken} 
                    bizList={this.state.bizList}
                    setSelectedRows={this.setSelectedRows}
                    getBizData={this.getBizData}
                />
            }
            {this.state.openPerson &&
            <PersonComponent 
              userToken={this.props.userToken} 
              adminId={this.props.adminId}
              openPerson={this.state.openPerson}
              handleSuccess={this.handleCRUDSuccess}s
              personModel={this.state.personModel}
              loginModel={this.state.loginModel}
              handlePersonSubmit={this.handleSubmit}
              handleClose={this.togglePerson}
              actionType={this.state.actionType}
              roleList={this.state.roleList}
            />}    
        </div>
      );
   }
}

export default BizDashboardComponent;