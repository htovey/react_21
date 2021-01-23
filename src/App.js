import React, { Component } from 'react';
import './styles/App.css';
import AppBar from 'material-ui/AppBar';
import LoginComponent from './components/login/LoginComponent';
import PersonComponent from './components/person/PersonComponent';
import PersonListComponent from './components/person/PersonListComponent';
import { createMuiTheme, MuiThemeProvider } from 'material-ui/styles';
import FetchUtil from './utils/FetchUtil';
import PersonListToolbar from './components/person/PersonListToolbar';
import CustomSnackBar from './components/custom/CustomSnackBar';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from "@material-ui/core/Tooltip";
import WaitModalComponent from './components/modals/WaitModalComponent';
import DashboardComponent  from './components/dashboard/DashboardComponent';

class App extends Component {
  constructor() {
    super();
    this.state = {
      personList: [],
      openLogin: true,
      openPerson: false,
      showDashboard: false,
      showPersonList: false,
      loading: false,
      userToken: '',
      adminId: '',
      snackBarOpen: false,
      vertical: 'top',
      horizontal: 'center',
      actionType: 'create',
      personModel: {
        id: '',
        fName: '',
        lName: '',
        adminId: ''
      },
      loginModel: {
        userName: '',
        password: '',
        roleType: ''
      }
    }
  }

  handleSubmit = (url, payload, event) => {
    event.preventDefault();
    //build person payload
    
    this.setState({loading: true});
    var response = FetchUtil.handlePost(url, this.state.userToken, JSON.stringify(payload))
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

  handleLoginSuccess = (json, token) => {
   // console.log('handleLoginSuccess()'+json.person.fName);
    this.setPersonModel(json.person);
    this.setLoginModel(json.user);
    this.setState({userToken: token});
    this.setState({openLogin: false});
    this.setState({showDashboard: true});
   // this.setState({personList: this.buildPersonList(persons, this.getFormattedDate)});
   // this.togglePersonList();
  }

  handleCRUDSuccess = (action) => {
    console.log("handleCRUDSuccess action:"+action);
    this.setState({
      openPerson : false, 
      //personModel : this.setPersonModel,
      actionType: action
    });
    this.setState({snackBarOpen: true});
   // this.refreshPersonList();
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
      this.setState({personList: this.buildPersonList(json, this.getFormattedDate)});
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
    // var id = '';
    // var userName = '';
    // var fname = '';
    // var lname = '';

    // if (person) {
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

  setLoginModel = (loginModel) => {
    if (loginModel && this.state.loginModel.userName === '') {
      this.setState({loginModel: {
        userName: loginModel.userName,
        password: loginModel.password,
        roleType: loginModel.roleType,
      }});
      if (loginModel.roleType === 'SUPER' || loginModel.roleType === 'ADMIN') {
        this.setState({adminId: loginModel.userId});
      }
    } else if (!loginModel) {
      this.setState({loginModel: {
        userName: '',
        password: '',
        roleType: ''
      }});
    }
  }

  getPersonFormData = (updatePersonModel) => {
    if (updatePersonModel) {
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

  getFormattedDate = (rawDate) => {
    var newDate = new Date(rawDate);
    const options = {
      day: 'numeric',
      month: 'long',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short',
      timeZone: 'America/New_York',
    };
    var date = newDate.toLocaleString('en-US', options);
    return date;
  }

  getSnackbarMsg = () => {
    var personAction = 'created';
    if (this.state.actionType === 'update') {
      personAction = 'updated';
    } else if (this.state.actionType === 'delete') {
      personAction = 'deleted'
    }
    var msg = 'Success! Person '+personAction+'.'
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

  setSelectedRows = (rowData) => {
    var index = this.state.selectedRows.length;
    rowData.map(row => {
      this.state.selectedRows[index] = row;
      index++;
    });
  } 

  render() {
    return (
      
      <MuiThemeProvider>
        <div className="App">
          <AppBar title="Nerd Persons" showMenuIconButton={false} className={"AppBar"}>
          </AppBar> 
          <CustomSnackBar 
            open={this.state.snackBarOpen} 
            vertical={this.state.vertical} 
            horizontal={this.state.horizontal}
            getAlertMsg={this.getSnackbarMsg}
            handleClose={this.closeSnackBar}
          />
          {this.state.openLogin &&
            <LoginComponent 
              openLogin={this.state.openLogin}
              handleLoginSuccess={this.handleLoginSuccess}
            />}   

          {this.state.showDashboard &&
            <DashboardComponent 
              togglePerson={this.togglePerson}
              getPersonFormData={this.getPersonFormData}
              handleCRUDSuccess={this.handleCRUDSuccess}
              adminId={this.state.adminId}
              appLoginModel={this.state.loginModel}
              appPersonModel={this.state.personModel}
              userToken={this.state.userToken}
              handleSubmit={this.handleSubmit}
            />}  
          {this.state.showPersonList && 
            <PersonListComponent 
              handleSuccess={this.handleCRUDSuccess} 
              userToken={this.state.userToken} 
              persons={this.state.personList}
              setSelectedRows={this.setSelectedRows}
              getPersonFormData={this.getPersonFormData}
            />}    
          {this.state.openPerson &&
            <PersonComponent 
              userToken={this.state.userToken} 
              adminId={this.state.adminId}
              openPerson={this.state.openPerson}
              handleSuccess={this.handleCRUDSuccess}s
              personModel={this.state.personModel}
              loginModel={this.state.loginModel}
              handlePersonSubmit={this.handleSubmit}
              handleClose={this.togglePerson}
              actionType={this.state.actionType}
            />}     
        </div>
       </MuiThemeProvider>
    );
  }
};

export default App;
