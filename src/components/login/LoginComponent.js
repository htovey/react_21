import React, {Component} from 'react';
import LoginFormDialog  from './LoginFormDialog';
import ResetPasswordDialog from './ResetPasswordDialog';
import '../../styles/App.css';
import  base64  from 'base-64';
import FetchUtil from '../../utils/FetchUtil';


class LoginComponent extends Component {
    //1) setup our state using constructor
    
    constructor(props) {
        super(props);
        this.state={
            toggleError: 'false',
            openResetForm: false,
            showPassword: true,
            styleClass: 'showMe',
            error: '',
            localLoginModel: {
                "username": '',
                "password": '',
                "roleId": '',
                "roleName": '',
                "roleType": ''
            },
            resetLoginModel: {
                "username": '',
                "password": '',
                "roleId": '',
                "userId": ''
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('LoginComponent componentDidUpdate()');
        if (prevProps.openLogin !== this.props.openLogin) {
           this.setState({openLogin: this.props.openLogin});
        }
    }

    passwordReset = () => {
        this.setState({openResetForm: true});
        this.setState({showPassword: false});
    }

    handleLoginSuccess(json, userToken) {
        this.setState({openLogin: false});
        this.props.handleLoginSuccess(json, userToken, false);
    }

    handleError(message) {
        console.log('LoginComponent handleError()');
        if(this.props.openLogin === true) {
            this.setState({ error: message});
        }
    }

    validLogin = (username, password) => {
        if (!username && !password) {
            this.handleError('Please enter User Id and Password.');
            return false;
        } else if (!username) {
            this.handleError('Please enter a User Id.');    
        } else if (!password) {
            this.handleError('Please enter a Password.');
        }else {
            //make sure any previous error is cleared
            this.setState({error: ''});
            return true;
        }
    }

    handleLookupSuccess = (userJson) => {
        console.log('trying to set showPassword = true');
        this.setState({
            resetLoginModel: {
                "username": userJson.userName,
                "password": "",
                "roleId": userJson.roleId,
                "userId": userJson.userId
            }
        });
        this.setState({showPassword: true});
    }
    
    handleResetSuccess = () => {
        this.setState({openResetForm: false});
        this.props.handleResetSuccess();
    }

    handleResetSubmit = (username, password, event)  => {
        event.preventDefault();
        if (this.validLogin) {
            const url = "/reset";
            const payload = {
                "userName" : this.state.resetLoginModel.username,
                "password" : password,
                "roleId" : this.state.resetLoginModel.roleId,
                "id" : this.state.resetLoginModel.userId
            }
            var response = FetchUtil.handlePost(url, null, JSON.stringify(payload));
            response
            .then(response => {
                if (response.status === 200) {
                    this.handleResetSuccess();
                }
            })
            .catch((error) => {});
        }
    }

    handleResetUserLookup = (username, event) => {
        if(!username) {
            this.handleError('Please enter a User Id.');
        } else {
            event.preventDefault();
            const url = "/reset";
            const params = {"userName" : username};
            FetchUtil.handleGet(url, null, params)
            .then(response => response.json())
            .then(json => {
                console.log("LoginComponent handleClick() response");
               // this.setState({styleClass: 'hideMe'});
                this.handleLookupSuccess(json);
            })
            .catch((error) => {
                this.handleError('User not found. Please try again.');
            });
        }
    }

    handleLogin = (username, password, event) => {    
        if (this.validLogin(username, password)) {
            event.preventDefault();
            //build login payload
            const loginUrl = "/login";
            const userToken = "Basic "+base64.encode(username+":"+password)
            var response = FetchUtil.handleGet(loginUrl, userToken);
            response
            .then(response => response.json())
            .then(json => {
                console.log("LoginComponent handleClick() response");
               // this.setState({styleClass: 'hideMe'});
                this.props.handleLoginSuccess(json, userToken, username, password);
            })    
            .catch((error) => {
                this.handleError('Login failed. Please try again.');
            });
        }
    } //end handleClick()

     checkPasswordState = () => {
        var showPword = this.state.allowPasswordReset || !this.state.openResetForm;
        this.setState({showPassword : showPword});
    }

    render() {
       
        return (
            <div>       
                <div>     
                {!this.state.openResetForm &&<LoginFormDialog 
                    openLogin={this.props.openLogin} 
                    error={this.state.error} 
                    styleClass={this.state.styleClass} 
                    handleLogin={this.handleLogin}
                    passwordReset={this.passwordReset}
                    resetUser={this.state.resetLoginModel.username}
                    loginModel={this.state.localLoginModel}
                />}
                {this.state.openResetForm && <ResetPasswordDialog
                    openResetForm={this.state.openResetForm}
                    showPassword={this.state.showPassword}
                    error={this.state.error}
                    handleResetUserLookup={this.handleResetUserLookup}
                    handleResetPassword={this.handleResetSubmit}
                    resetLoginModel={this.state.resetLoginModel}
                />}
                </div>        
            </div>
        );
    }
}
export default LoginComponent;