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
            showUser: true,
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
 
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('PersonComponent componentDidUpdate()');
        if (prevProps.openPersonForm !== this.props.openPersonForm) {
           this.setState({openPersonForm: this.props.openPersonForm});
        }
        
        if (!this.props.openPersonForm && this.state.error !== '') {
            this.setState({error: ''});
        }

        // if (prevProps.user !== this.props.user) {
        //     this.setState({user: this.props.user});
        // }
    }

    handleError(message) {
        console.log('PersonComponent handleError()');
        if(this.props.openPersonForm === true) {
            this.setState({ error: message});
        }
    }

    handleSubmitUserSuccess(username) {
        if (this.props.actionType === "create") {
            this.setState({
                showUser: false,
                showProfile: true,
            });
            console.log("userName: "+this.state.loginModel.userName);
            //this.setState({showProfile: true});
        } else {
            this.props.togglePerson("update");
        }
    }

    handleUserSubmit = (user, e) => {
        e.preventDefault();
        this.setState({loading: true});

        const url = "/user/"+this.props.actionType;
        const payload = {
            "id" : user.userId,
            "userName" : user.userName,
            "password" : user.password,
            "adminId" : this.props.adminId,
            "bizId" : this.props.bizId,
            "roleId" : user.roleId
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

    render() {
       
        return (
            <div>       
                <div>     
                    <PersonFormDialog 
                        openPerson={this.props.openPersonForm} 
                        error={this.state.error} 
                        styleClass={this.state.styleClass} 
                        handlePersonSubmit={this.props.handlePersonSubmit}
                        handleUserSubmit={this.handleUserSubmit}
                        personModel={this.props.personModel}
                        loginModel={this.props.loginModel}
                        handleClose={this.props.handleClose}
                        actionType={this.props.actionType}
                        showLogin={this.state.showUser}
                        showProfile={this.props.showProfileForm || this.state.showProfile}
                        adminId={this.props.adminId}
                        bizId={this.props.bizId}
                        roleList={this.props.roleList}
                    />          
                </div>        
            </div>
        );
    }
}
export default PersonComponent;