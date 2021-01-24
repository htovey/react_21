import React, {Component} from 'react';
import PersonFormDialog  from './PersonFormDialog';
import '../../styles/App.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import FetchUtil from '../../utils/FetchUtil';

class PersonComponent extends Component {
    //1) setup our state using constructor
    
    constructor(props) {
        super(props);
        this.state={
            styleClass: 'showMe person',
            error: '',
            showProfile: false,
            showUser: true
        }
    }
 
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('PersonComponent componentDidUpdate()');
        if (prevProps.openPerson !== this.props.openPerson) {
           this.setState({openPerson: this.props.openPerson});
        }
        
        if (!this.props.openPerson && this.state.error !== '') {
            this.setState({error: ''});
        }

        // if (prevProps.user !== this.props.user) {
        //     this.setState({user: this.props.user});
        // }
    }

    handleError(message) {
        console.log('PersonComponent handleError()');
        if(this.props.openPerson === true) {
            this.setState({ error: message});
        }
    }

    handleSubmitUserSuccess(username) {
        if (this.props.actionType === "create") {
            this.setState({
                showUser: false,
                showProfile: true,
            });
            console.log("userName: "+this.state.personModel.userName);
            //this.setState({showProfile: true});
        }
    }

    handleUserSubmit = (user, e) => {
        e.preventDefault();
        this.setState({loading: true});

        const url = "/user/"+this.props.actionType;
        const payload = {
            "userName" : user.userName,
            "password" : user.password,
            "adminId" : this.props.adminId
        }

        var response = FetchUtil.handlePost(url, this.props.userToken, JSON.stringify(payload))
        .then(response => {
            if (response.status === 200 || response.status === 201) {
                console.log("Success***");
                this.handleSubmitUserSuccess(user.userName);
            }
        })    
        .catch((error) => {
            console.log(error);
            this.handleError('Save failed. Please try again.');
        });
    }

    handlePersonSubmit = (person, e) => {
        console.log('stop here');
        const personUrl = "/person"
        const personBody =  {
            "id": person.id || "",
            "fName": person.fName,
            "lName": person.lName,
            "userName": person.userName,
        }
               
        //if (this.validPerson(person)) {
            this.props.handlePersonSubmit(personUrl, personBody, e);
        //}
    };

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

    render() {
       
        return (
            <div>       
                <div>     
                    <PersonFormDialog 
                        openPerson={this.props.openPerson} 
                        error={this.state.error} 
                        styleClass={this.state.styleClass} 
                        handlePersonSubmit={this.handlePersonSubmit}
                        handleUserSubmit={this.handleUserSubmit}
                        personModel={this.props.personModel}
                        globalLoginModel={this.props.loginModel}
                        handleClose={this.props.handleClose}
                        actionType={this.props.actionType}
                        showLogin={this.state.showUser}
                        showProfile={this.state.showProfile}
                        adminId={this.props.adminId}
                        roleList={this.props.roleList}
                    />          
                </div>        
            </div>
        );
    }
}
export default PersonComponent;