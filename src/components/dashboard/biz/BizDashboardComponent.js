import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import CardHeader from '@material-ui/core/CardHeader';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import '../../../styles/Dashboard.css';
import BizModel from '../../../models/BizModel';
import BizComponent from './BizComponent';
import BizListComponent from './BizListToolbarSelect'; 
import CustomSnackBar from '../../custom/CustomSnackBar';
import PersonComponent from '../../person/PersonComponent';
import FetchUtil from '../../../utils/FetchUtil';
import PersonListComponent from '../../person/PersonListComponent';

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
        error: '',
        openBizForm: false,
        personModel: {
          id: '',
          fName: '',
          lName: '',
          adminId: ''
        },
        loginModel: {
          userId: '',
          userName: '',
          password: '',
          roleId: '',
          roleName: '',
          roleType: '',
          bizId: ''
        },
        bizList: [],
        roleList: [],
        personList: [],
        actionType: '',
        entityType: '',
        snackBarOpen: false,
        openPersonForm: false,
        showProfileForm: false,
        showPersonList: false,
        showAdminList: false,
        vertical: 'top',
        horizontal: 'center',
        loading: false
     }
  }

  createPerson = (e) => {
    this.getRoleListAndTogglePerson(this.props.bizModel.id, "create", e);
    //this.togglePerson("create");
  }

  editBiz = () => {
    this.setState({openBizForm: true});
  }

  togglePerson = (toggleActionType) => {
    console.log('toggle biz person');
    this.setState({actionType: toggleActionType});
    this.setState({openPersonForm: !this.state.openPersonForm});
  }

  setLoginModel = (loginType, loginData, actionType) => {
    if (loginType === 'global') {
      this.setState({loginModel: this.props.loginModel});
    }
    if (loginData) {
      this.setState({loginModel: {
        userId: loginData.userId,
        userName: loginData.userName,
        password: loginData.password,
        roleId: loginData.roleId,
        roleName: loginData.roleName,
        roleType: loginData.roleType,
        bizId: loginData.bizId
      }});
      this.getRoleListAndTogglePerson(loginData.bizId, actionType, null);
    }
  }
  
  setRoleListAndTogglePerson = (roles, actionType) => {
    var myList = [];
    roles.map(function(role) {
      myList.push(role);
    });
    this.setState({roleList: myList});
    this.togglePerson(actionType);
  }

  loadUserLoginData = (userName) => {
    //e.preventDefault();
    var url = "/user"
    var params = {"userName" : userName};
    FetchUtil.handleGet(url, this.props.userToken, params)
    .then(response => response.json())
    .then(json => {
      this.setLoginModel("local",json, "update");
    })
    .catch((error) => {
      console.log(error);
      this.handleError('get user data failed. Please try again.');
    });
  }
//entry point for loading person form
  getPersonFormData = (updatePersonModel) => {
    if(updatePersonModel) {
      if (Array.isArray(updatePersonModel)) {
        var username = updatePersonModel[1];
        this.loadUserLoginData(username);
        console.log("updating person model");
        //updatePersonModel = (4) ["harryp", "Harry", "Potter", "2021-01-29 13:46:37.0"]
        this.setState({
          personModel: {
            id: updatePersonModel[0],
            userName: username,
            fName: updatePersonModel[2],
            lName: updatePersonModel[3]
          }
        });        
      } else if (typeof updatePersonModel === "object") {
      //{"userName":"harryp","password":"hockey","roleType":"ADMIN","roleId":6,"userId":"16","bizId":2}
        username = updatePersonModel.userName;
        this.loadUserLoginData(username);
        this.setState({
          personModel: {
            userName: username,
            id: updatePersonModel.id,
            fName: updatePersonModel.fName,
            lName: updatePersonModel.lName
          }
        });
      }

      //this.setState({actionType: "update"});
      this.setState({showProfileForm: true}); 

    }else if (this.state.personModel) {
      this.setState({actionType: "update"});
      this.setState({showProfileForm: true}); 
    } else {
      this.setState({actionType: "create"});
    }
    //this.setState({openPersonForm: true});
  }
 
  handlePersonSubmit = (person, e) => {
    const url = "/person/"+this.state.actionType;
    const payload = {
        "id" : person.id,
        "fName" : person.fName,
        "lName" : person.lName,
        "userName" : person.userName
    }
    var response = FetchUtil.handlePost(url, this.props.userToken, JSON.stringify(payload));
    response
    .then(response => response.json())
            .then(json => {
              console.log("BizDashboard handlePersonSubmit() response");
               this.handleCRUDSuccess("create", "personFrom");
            }) 
    .catch((error) => {
      console.log("ERROR:  "+error);
      this.handleError('Save failed. Please try again.');
    });
  }

  handleBizSubmit = (biz, e) => {
    e.preventDefault();
    const url = "/biz/update"
    const payload = {
        "name" : biz.name,
        "type" : biz.type,
        "id" : biz.id
    }
    var response = FetchUtil.handlePost(url, this.props.userToken, JSON.stringify(payload));
    response
    .then(response => response.json())
    .then(json => {
      console.log("BizDashboard handleClick() response");
      this.handleCRUDSuccess("update", "bizForm");
    }) 
    .catch((error) => {
      console.log("ERROR:  "+error);
      this.handleError('Save failed. Please try again.');
    });
  }

  handleCRUDSuccess = (action, entity) => {
    console.log("handleCRUDSuccess action:"+action);
    this.toggleForm(action, entity);
    this.setState({snackBarOpen: true});
   // this.refreshPersonList();
  }

  toggleForm = (action, entity) => {
    if (entity === "Biz") {
      this.setState({openBizForm : !this.state.openBizForm});
    }
    
    if (entity === "Person") {
      this.setState({openPersonForm: !this.state.openPersonForm});
    }
    this.setState({entityType: entity});  
    this.setState({actionType: action});
  }

  togglePerson = (toggleActionType) => {
    console.log('toggle biz person');
    // if(toggleActionType === "create") {
    //   this.setLoginModel();
    // }

    // if (this.state.showPersonList) {
    //   this.refreshPersonList()
    // };
    this.setState({actionType: toggleActionType});
    this.setState({openPersonForm: !this.state.openPersonForm});
  }

  handleError(message) {
    console.log('Biz Dashboard handleError()');
    if(this.props.openBizForm === true) {
        this.setState({ error: message});
    }
  }

  getSnackbarMsg = () => {
    var action = 'created';
    if (this.state.actionType === 'update') {
      action = 'updated';
    } else if (this.state.actionType === 'delete') {
      action = 'deleted'
    }
    var msg = 'Success!'+this.state.entityType+' '+action+'.'
    return msg;
  }

  closeSnackBar = () => {
    this.setState({snackBarOpen: false});
  }

  getRoleListAndTogglePerson = function(bizId, actionType, e) {
    if (e) {e.preventDefault();}
    var url = "/roles";
    var params = {"bizId" : bizId};
    FetchUtil.handleGet(url, this.props.userToken, params)
    .then(response => response.json())
    .then(json => {
       this.setRoleListAndTogglePerson(json, actionType);
    })
    .catch((error) => {
      console.log(error);
      this.handleError('get role list failed. Please try again.');
    }); 
  }

  getAdminList = () => {
    this.getPersonList(this.props.bizModel.id, "ADMIN");
    this.setState({showAdminList: true});
  }

  editPerson = (index) => {
    var updatePerson = this.state.personList[index];
    this.getPersonFormData(updatePerson);
  }

  getPersonList = (bizId, roleType) => {
      console.log("getPersonList()");
      var url = "/person/persons";
      var params = {
        "bizId" : bizId,
        "roleType" : roleType
      };
      var result = FetchUtil.handleGet(url, this.props.userToken, params);
      result
      .then(response => response.json())
      .then(json => {
       // this.setState({loading: false});
       // this.setState({snackBarOpen: true});
        this.setState({personList: json});
      })
      .catch((error) => {
        return error;
      });
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
                <Grid container spacing={0}>
                  <Grid item md={3}>
                    <Card className={classes.paper}>
                      <CardHeader title={this.props.bizModel.name}/>
                      <CardActions>
                        <Button onClick={this.editBiz}>Update Biz Info</Button> 
                      </CardActions>
                    </Card>
                  </Grid>
                  <Grid item md={3}>
                    <Card className={classes.paper}>
                      <CardHeader title="Admin Profiles"/>
                      <CardActions>
                        <Button onClick={this.getAdminList}>View Admin List</Button>
                        <Button onClick={this.createPerson}>Add Biz Admin</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
            </Grid>
            {this.state.openBizForm &&
                <BizComponent
                    error={this.state.error}
                    userToken={this.props.userToken} 
                    adminId={this.props.adminId}
                    openBizForm={this.state.openBizForm}
                    bizModel={this.props.bizModel}
                    loginModel={this.props.loginModel}
                    handleClose={this.toggleBiz}
                    actionType={this.state.actionType}
                    handleSubmit={this.handleBizSubmit}
                />
            }
            {this.state.openPersonForm &&
            <PersonComponent 
              userToken={this.props.userToken} 
              adminId={this.props.adminId}
              bizId={this.props.bizModel.id}
              openPersonForm={this.state.openPersonForm}
              showProfileForm={this.state.showProfileForm}
              personModel={this.state.personModel}
              loginModel={this.state.loginModel}
              handlePersonSubmit={this.handlePersonSubmit}
              handleClose={this.togglePerson}
              actionType={this.state.actionType}
              roleList={this.state.roleList}
            />}    
            {this.state.showAdminList && 
            <PersonListComponent
              handleSuccess={this.handleCRUDSuccess} 
              userToken={this.props.userToken} 
              personList={this.state.personList}
              //setSelectedRows={this.setSelectedRows}
              getPersonFormData={this.getPersonFormData}
              editPerson={this.editPerson}
            />}
        </div>
      );
   }
}

export default BizDashboardComponent;