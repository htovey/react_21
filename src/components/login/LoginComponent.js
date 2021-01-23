import React, {Component} from 'react';
import LoginFormDialog  from './LoginFormDialog';
import '../../styles/App.css';
import  base64  from 'base-64';
import FetchUtil from '../../utils/FetchUtil';


class LoginComponent extends Component {
    //1) setup our state using constructor
    
    constructor(props) {
        super(props);
        this.state={
            toggleError: 'false',
            styleClass: 'showMe',
            error: '',
            localLoginModel: {
                "username": '',
                "password": '',
                "roleType": ''
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('LoginComponent componentDidUpdate()');
        if (prevProps.openLogin !== this.props.openLogin) {
           this.setState({openLogin: this.props.openLogin});
        }
    }

    handleLoginSuccess(json, userToken) {
        this.setState({openLogin: false});
        this.props.handleSuccess(json, userToken, false);
    }

    handleLoginError(message) {
        console.log('LoginComponent handleLoginError()');
        if(this.props.openLogin === true) {
            this.setState({ error: message});
        }
    }

    validLogin = (username, password) => {
        if (!username && !password) {
            this.handleLoginError('Please enter User Id and Password.');
            return false;
        } else if (!username) {
            this.handleLoginError('Please enter a User Id.');    
        } else if (!password) {
            this.handleLoginError('Please enter a Password');
        }else {
            //make sure any previous error is cleared
            this.setState({error: ''});
            return true;
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
                this.handleLoginError('Login failed. Please try again.');
            });
        }
    } //end handleClick()

    render() {
       
        return (
            <div>       
                <div>     
                <LoginFormDialog 
                    openLogin={this.props.openLogin} 
                    error={this.state.error} 
                    styleClass={this.state.styleClass} 
                    handleLogin={this.handleLogin}
                    loginModel={this.state.localLoginModel}
                    />
                </div>        
            </div>
        );
    }
}
export default LoginComponent;