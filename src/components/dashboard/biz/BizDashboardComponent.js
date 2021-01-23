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
import FetchUtil from '../../../utils/FetchUtil';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
            id: '',
            name: '',
            type: ''
        },
        bizList: [],
        roleList: [],
        actionType: '',
        snackBarOpen: false,
        vertical: 'top',
        horizontal: 'center',
        loading: false
     }
  }
  
  editPerson = () => {
    //this.props.getBizDataAndSetAction();
    //this.props.viewProfile("update");
  } 

  createPerson = (e) => {
    this.getRoleList(this.state.bizModel.type, e);
    this.props.togglePerson("create");
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

  togglePerson = (actiontype, roleId) => {
    console.log("biz dashboard - toggle person");
    if (actiontype === "create") {
      
    }
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
  getBizDataAndSetAction = (updateBizModel) => {
    if (updateBizModel) {
      console.log("updating biz model");
      this.setState({bizModel: {
        id: updateBizModel.id,
        name: updateBizModel.name,
        type: updateBizModel.type
      }, actionType: "update"});
    } else if (this.state.bizModel) {
      this.setState({actionType: "update"});
    } else {
      this.setState({actionType: "create"});
    }
    this.setState({openBizForm: true});
  }

  getRoleList = (bizType, e) => {
    e.preventDefault();
    var params = {"bizType" : bizType};
    var url = "/roles";
    url.search = new URLSearchParams(params).toString();
    FetchUtil.handleGet(url, this.props.userToken)
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
            this.handleError('Save failed. Please try again.');
        }); 
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
                      <Typography>
                        New Biz
                      </Typography>
                      <CardActions>
                        <Button onClick={this.createBiz}>Add Biz</Button> 
                        <Button onClick={this.createBizAdmin}>Add Biz Admin</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item xs={2}>
                    <Card className={classes.paper}>
                      <Typography>
                        Biz Profiles
                      </Typography>
                      <CardActions>
                        <Button onClick={this.props.getBizList}>View</Button>
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
                    handleSuccess={this.handleCRUDSuccess}s
                    bizModel={this.state.bizModel}
                    loginModel={this.props.loginModel}
                    handleBizSubmit={this.handlePostSubmit}
                    handleClose={this.toggleBiz}
                    actionType={this.state.actionType}
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
        </div>
      );
   }
}

export default BizDashboardComponent;