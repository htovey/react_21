import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import '../../styles/Dashboard.css';
import BizDashboardComponent from './biz/BizDashboardComponent';
import BizComponent from './biz/BizComponent';
import BizListComponent from './biz/BizListComponent';
import FetchUtil from '../../utils/FetchUtil';

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

class DashboardComponent extends Component {
  constructor(props) {
     super(props);
     this.state = {
       loginModel: {
         userName: props.appLoginModel.userName,
         password: props.appLoginModel.password,
         roleType: props.appLoginModel.roleType
       },
       openBizForm: false,
       openBizDashboard: false,
       showBizList: false,
       bizList: [],
       bizModel: {
           id: '',
           name: '',
           type: ''
       },
     }
  }
  
  setLoginModel = () => {
    if (this.props.appLoginModel.roleType === 'SUPER') {
      this.setState({loginModel: this.props.appLoginModel});
    }
  }

  editBiz = () => {
    this.props.getBizData();
    this.props.vieBizProfile("update");
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

  buildBizList(bizJson) {
    console.log('build biz list');
    var myBizList = [];
    bizJson.map(function(biz) { 
     // biz.saveDate = this.props.dateFormatter(biz.saveDate);
      myBizList.push(biz);
    })
    // personList.push([person.id,person.fName,person.lName, dateFormatter(person.saveDate)]);
    console.log('set biz list in state');
    this.setState({bizList: myBizList});
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

  getBizList = (e) => {
    var url = "/biz/bizList";
    FetchUtil.handleGet(url, this.props.userToken)
    .then(response => response.json())
    .then(json => {
     // this.setState({loading: false});
     // this.setState({snackBarOpen: true});
      this.buildBizList(json);
      this.setState({showBizList: true});
    })
    .catch((error) => {
      return error;
    });
  }

  getBizDataAndSetAction = (updateBizModel) => {
    if (updateBizModel) {
      console.log("updating biz model");
      this.setState({
        bizModel: {
          id: updateBizModel[0],
          type: updateBizModel[1],
          name: updateBizModel[2]
        }
      }); 
      this.setState({actionType: "update"});
      this.setState({openBizDashboard: true});  
    } else {
      this.setState({actionType: "create"});
      this.setState({openBizForm: true});
    }
  }

  render () {
    var classes = useStyles;
    return (
      <div className={classes.root}>
        {this.state.openBizDashboard && 
          <BizDashboardComponent
            loginModel={this.state.loginModel}
            bizModel={this.state.bizModel}
            adminId={this.props.adminId}
            userToken={this.props.userToken}
            handleSubmit={this.props.handleSubmit}
            togglePerson={this.props.togglePerson}
          />}
          {this.state.openBizForm &&
            <BizComponent
                userToken={this.props.userToken} 
                adminId={this.props.adminId}
                openBizForm={this.state.openBizForm}
                handleSuccess={this.handleCRUDSuccess}
                bizModel={this.state.bizModel}
                loginModel={this.props.loginModel}
                handleBizSubmit={this.handlePostSubmit}
                handleClose={this.toggleBiz}
                actionType={this.state.actionType}
            />
          }
          {this.state.showBizList && !this.state.openBizDashboard &&
            <BizListComponent
              handleSuccess={this.handleCRUDSuccess} 
              userToken={this.props.userToken} 
              bizList={this.state.bizList}
              setSelectedRows={this.setSelectedRows}
              //getBizFormData={this.getBizDataAndSetAction}
              bizRowClick={this.getBizDataAndSetAction}
            />
          }
          {!this.state.showBizList && !this.state.openBizDashboard &&
            <Grid >
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Card className={classes.paper}>
                    <Typography>
                      My Profile
                    </Typography>
                    <CardActions>
                      <Button onClick={this.editPerson}>View</Button>
                      <Button onClick={this.editPerson}>Edit</Button>
                    </CardActions>
                  </Card>
                </Grid>
                {this.props.adminId !== '' &&
                <Grid item xs={2}>
                  <Card className={classes.paper}>
                    <Typography>
                      Team Profiles
                    </Typography>
                    <CardActions>
                      <Button onClick={this.getBizList}>View Biz List</Button>
                      <Button onClick={this.toggleBiz}>Add Biz</Button>
                    </CardActions>
                  </Card>
                </Grid>}
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={2}>
                  <Card className={classes.paper}>Time Entry</Card>
                </Grid>
                {this.props.adminId !== '' &&
                <Grid item xs={2}>
                  <Card className={classes.paper}>Team Time Entry</Card>
                </Grid>}
              </Grid>
          </Grid>}
      </div>
    );
   }
}

export default DashboardComponent;