import React, {Component} from 'react';
import PersonFormDialog  from './PersonFormDialog';
import '../../styles/App.css';
import CircularProgress from '@material-ui/core/CircularProgress';

class PersonComponent extends Component {
    //1) setup our state using constructor
    
    constructor(props) {
        super(props);
        this.state={
            styleClass: 'showMe person',
            error: ''
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

    handleValidationAndSubmit = (person, e) => {
        console.log('stop here');
        if (this.validPerson(person)) {
            this.props.handlePersonSubmit(person, e);
        }
    };

    validPerson = (person) => {
        if (!person.fName || !person.lName || !person.userName) {
            this.handleError('Please fill out all fields.');
        } else {
            //make sure any previous error is cleared
            this.setState({error: ''});
            return true;
        }
    }

    render() {
       
        return (
            <div>       
                <div>     
                    <PersonFormDialog 
                        openPerson={this.props.openPerson} 
                        error={this.state.error} 
                        styleClass={this.state.styleClass} 
                        handlePersonValSubmit={this.handleValidationAndSubmit}
                        personModel={this.props.personModel}
                        handleClose={this.props.handleClose}
                    />          
                </div>        
            </div>
        );
    }
}
export default PersonComponent;