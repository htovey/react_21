import React, { Component } from 'react';
import './styles/Dashboard.css';
import { Button, Card, CardActions, Grid, Typography, AppBar } from '@material-ui/core';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import LoginComponent from './components/login/LoginComponent';
import PersonComponent from './components/person/PersonComponent';
import BizDashboardComponent from './components/dashboard/biz/BizDashboardComponent';
import BizComponent from './components/dashboard/biz/BizComponent';
import BizListComponent from './components/dashboard/biz/BizListComponent';
import FetchUtil from './utils/FetchUtil';
import DateUtil from './utils/DateUtil';
import CustomSnackBar from './components/custom/CustomSnackBar';
import { blue } from '@material-ui/core/colors';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      personList: [],
      openLogin: true,
      openPerson: false,
      openBizDashboard: false,
      showPersonList: false,
      showBizMenu: false,
      loading: false,
      userToken: '',
      adminId: '',
      snackBarOpen: false,
      vertical: 'top',
      horizontal: 'center',
      actionType: 'create',
      entityType: '',
      title: 'Dashboard',
      bizModel: {
        id: '',
        name: '',
        type: ''
      },
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
      }
    }
  }

  bizTheme = createMuiTheme({
    overrides: {
      AppBar: {
        backgroundColor: 'blue'
      }
    }
  });

  createBiz = () => {
    this.setState({openBizForm: !this.state.openBizForm});
  }

  loadBizModel = (bizId) => {
    this.setState({loading: true});
    var url = "/biz";
    var params = {"id": bizId};
    var response = FetchUtil.handleGet(url, this.state.userToken, params)
    .then(response => response.json())
    .then(json => {
      this.setBizModel(json);
      this.setState({appBarClass: "BizAppBar"});
      this.setState({title: "Biz Dashboard"});
      this.setState({openBizDashboard: true});
    })
    .catch((error) => {
      return error;
    });
  }

  handlePostSubmit = (url, payload, event) => {
    event.preventDefault();
    
    this.setState({loading: true});
    var response = FetchUtil.handlePost(url, this.state.userToken, JSON.stringify(payload))
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                console.log("Success***");
                this.handleCRUDSuccess(this.state.actionType, this.state.entityType);
            }
        })    
        .catch((error) => {
            console.log(error);
            this.handleError('Save failed. Please try again.');
        }); 
  }

  handleLoginSuccess = (json, token) => {
   // console.log('handleLoginSuccess()'+json.person.fName);
    this.setState({userToken: token});
    this.setPersonModel(json.person);
    this.setLoginModel(json.user);
    this.setState({openLogin: false});
    this.updateDashboardView();
  }

  handleResetSuccess = () => {
    this.handleCRUDSuccess("update", "user");
    this.setLoginModel();
  }

  updateDashboardView = () => {
    if (this.state.appLoginModel.roleType === 'SUPER') {
      this.setState({showBizMenu: true});
      //this.setState({});
    }
  }

  handleCRUDSuccess = (action, entity) => {
    console.log("handleCRUDSuccess action:"+action);
    if (entity === "Person") {
      this.setState({openPerson : false});
    }

    if (entity === "User") {
      this.setState({openLogin: true});
    }
    this.setState({actionType: action});
    this.setState({entityType: entity});
    this.setState({snackBarOpen: true});
  }

  handleError = (message) => {
    console.log('PersonComponent handleError()');
    if(this.props.openPerson === true) {
        this.setState({ error: message});
    }
  }

  buildPersonList = (persons, dateFormatter) => {
    var personList = [];
    persons.map(function(person) { 
      person.saveDate = dateFormatter(person.saveDate);
      personList.push(person);
    })
    // personList.push([person.id,person.fName,person.lName, dateFormatter(person.saveDate)]);

    return personList;
  }
    
  refreshPersonList = () => {
    console.log("refreshPersonList()");
    var url = "/persons";
    var result = FetchUtil.handleGet(url, this.state.userToken);
    result
    .then(response => response.json())
    .then(json => {
     // this.setState({loading: false});
     // this.setState({snackBarOpen: true});
      this.setState({personList: this.buildPersonList(json, DateUtil.getFormattedDate)});
    })
    .catch((error) => {
      return error;
    });
  }

  togglePersonList = () => {
    if (this.state.showPersonList == true) {
      this.setState({showPersonList: false});
    } else {
      this.setState({showPersonList: true});
    }
  }

  setPersonModel = (person) => {
    var id = person ? person.id : '';
    var username = person ? person.userName : '';
    var fname = person ? person.fName : '';
    var lname = person ? person.lName : '';
    var adminid = person ? person.adminId : '';
    // }

    this.setState({
      personModel: {
        id: id,
        userName: username,
        fName: fname,
        lName: lname,
        adminId: adminid
      }
    });
  }

  setLoginModel = (updateLoginModel) => {
    //if we are logging in, update the model with that data
    if (updateLoginModel && this.state.loginModel.userName === '') {
      this.setState({loginModel: {
        userId: updateLoginModel.userId,
        userName: updateLoginModel.userName,
        password: updateLoginModel.password,
        roleId: updateLoginModel.roleId,
        roleName: updateLoginModel.roleName,
        roleType: updateLoginModel.roleType,
        bizId: updateLoginModel.bizId
      }});

      var role = updateLoginModel.roleType;
      if (role === 'SUPER' || role === 'ADMIN') {
        this.setState({adminId: updateLoginModel.userId});   
        this.setState({appLoginModel: updateLoginModel});     
      }

      if (role === 'ADMIN') {
        this.loadBizModel(updateLoginModel.bizId);
      }
      //we aren't logging in,  we are creating a new person so empty 
      //out the login model
    } else if (!updateLoginModel) {
      this.setState({loginModel: {
        userId: '',
        userName: '',
        password: '',
        roleId: '',
        roleName: '',
        roleType: '',
        bizId: ''
      }});
    }
  }

  setBizModel = (bizModel) => {
    if (bizModel) {
      this.setState({
        bizModel: {
          id: bizModel ? bizModel.bizId : '',
          name: bizModel ? bizModel.bizName : '',
          type: bizModel ? bizModel.bizType : ''
        }
      });
    } 
  }

  getPersonFormData = (updatePersonModel) => {
    if (Array.isArray(updatePersonModel)) {
      console.log("updating node model");
      this.setState({personModel: {
        id: updatePersonModel.id,
        userName: updatePersonModel.userName,
        fName: updatePersonModel.fName,
        lName: updatePersonModel.lName,
        adminId: updatePersonModel.adminId
      }, actionType: "update"});
    } else if (this.state.personModel) {
      this.setState({actionType: "update"});
    } else {
      this.setState({actionType: "create"});
    }
    this.setState({openPerson: true});
  }

  getSnackbarMsg = () => {
    var action = 'created';
    if (this.state.actionType === 'update') {
      action = 'updated';
    } else if (this.state.actionType === 'delete') {
      action = 'deleted'
    }
    var msg = 'Success! '+this.state.entityType+' '+action+'.'
    return msg;
  }

  closeSnackBar = () => {
    this.setState({snackBarOpen: false});
  }

  togglePerson = (toggleActionType) => {
    console.log('toggle person');
    if(toggleActionType === "create") {
      this.setPersonModel();
      this.setLoginModel();
    }

    if (this.state.showPersonList) {
      this.refreshPersonList()
    };
    this.setState({actionType: toggleActionType});
    this.setState({openPerson: !this.state.openPerson});
  }

  getBizList = (e) => {
    var url = "/biz/bizList";
    FetchUtil.handleGet(url, this.state.userToken)
    .then(response => response.json())
    .then(json => {
     // this.setState({loading: false});
     // this.setState({snackBarOpen: true});
      this.buildBizListTable(json);
      this.setState({showBizList: true});
    })
    .catch((error) => {
      return error;
    });
  }
  
  buildBizListTable(bizJson) {
    var myBizList = [];
    bizJson.map(function(biz) { 
      myBizList.push(biz);
    })
    console.log('set biz list in state');
    this.setState({bizList: myBizList});
  }

  loadBizAndSetAction = (updateBizModel) => {
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
      this.setState({showBizList: false}); 
    } else {
      this.setState({actionType: "create"});
      this.setState({openBizForm: true});
    }
  }

  render() {
    return (
      
      <MuiThemeProvider theme={this.state.openBizDashboard ? this.bizTheme : createMuiTheme()}>
        <div className="App">
          {this.state.openLogin &&
            <LoginComponent 
              openLogin={this.state.openLogin}
              handleLoginSuccess={this.handleLoginSuccess}
              handleResetSuccess={this.handleResetSuccess}
            />}  
          {!this.state.openLogin &&          
            <div>
              <AppBar className={this.state.appBarClass}>
                {this.state.title}
              </AppBar> 
              <CustomSnackBar 
                open={this.state.snackBarOpen} 
                vertical={this.state.vertical} 
                horizontal={this.state.horizontal}
                getAlertMsg={this.getSnackbarMsg}
                handleClose={this.closeSnackBar}
              />
            </div>
          }       
          {this.state.openPerson &&
            <PersonComponent 
              userToken={this.state.userToken} 
              adminId={this.state.adminId}
              openPersonForm={this.state.openPerson}
              personModel={this.state.personModel}
              loginModel={this.state.loginModel}
              handlePersonSubmit={this.handlePostSubmit}
              handleClose={this.togglePerson}
              actionType={this.state.actionType}
            />} 
          {this.state.openBizDashboard  && 
            <BizDashboardComponent
              loginModel={this.state.loginModel}
              bizModel={this.state.bizModel}
              adminId={this.state.adminId}
              userToken={this.state.userToken}
              handleSubmit={this.state.handleSubmit}
              togglePerson={this.state.togglePerson}
              buildPersonList={this.state.buildPersonList}
          />}
          {this.state.openBizForm &&
            <BizComponent
                userToken={this.props.userToken} 
                adminId={this.props.adminId}
                openBizForm={this.state.openBizForm}
                handleSuccess={this.handleCRUDSuccess}
                bizModel={this.props.bizModel}
                loginModel={this.props.loginModel}
                handleBizSubmit={this.handlePostSubmit}
                handleClose={this.toggleBiz}
                actionType={this.state.actionType}
            />
          }
          {this.state.showBizList &&
            <BizListComponent
              handleSuccess={this.handleCRUDSuccess} 
              userToken={this.state.userToken} 
              bizList={this.state.bizList}
              bizRowClick={this.loadBizAndSetAction}
            />
          }   
          {!this.state.openLogin && !this.state.showBizList && !this.state.openBizDashboard &&
            <Grid >
              <Grid container spacing={0}>
                <Grid item md={6}>
                  <Card className={"paper"}>
                    <Typography>
                      My Profile
                    </Typography>
                    <CardActions>
                      <Button onClick={this.getPersonFormData}>Edit</Button>
                    </CardActions>
                  </Card>
                </Grid>
                {this.state.showBizMenu &&
                <Grid item md={6}>
                  <Card className={"paper"}>
                    <Typography>
                      Biz Profiles
                    </Typography>
                    <CardActions>
                      <Button onClick={this.getBizList}>View Biz List</Button>
                      <Button onClick={this.createBiz}>Add Biz</Button>
                    </CardActions>
                  </Card>
                </Grid>}
              </Grid>
          </Grid>}
        </div>
       </MuiThemeProvider>
    );
  }
};

export default Dashboard;
