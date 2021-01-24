import React, {Component} from 'react';
import BizFormDialog  from './BizFormDialog';
import '../../../styles/App.css';
import FetchUtil from '../../../utils/FetchUtil';

class BizComponent extends Component {
    //1) setup our state using constructor
    
    constructor(props) {
        super(props);
        this.state={
            styleClass: 'showMe',
            error: ''
        }
    }
 
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('BizComponent componentDidUpdate()');
        if (prevProps.openBiz !== this.props.openBiz) {
           this.setState({openBiz: this.props.openBiz});
        }
        
        if (!this.props.openBiz && this.state.error !== '') {
            this.setState({error: ''});
        }

        // if (prevProps.user !== this.props.user) {
        //     this.setState({user: this.props.user});
        // }
    }

    handleError(message) {
        console.log('Biz Component handleError()');
        if(this.props.openBiz === true) {
            this.setState({ error: message});
        }
    }

    handleSubmitBizSuccess(username) {
        if (this.props.actionType === "create") {
            this.setState({
                showUser: false,
                showProfile: true,
            });
            console.log("userName: "+this.state.personModel.userName);
            //this.setState({showProfile: true});
        }
    }

    handleBizSubmit = (biz, e) => {
        e.preventDefault();
        this.setState({loading: true});

        const url = "/biz/"+this.props.actionType;
        const payload = {
            "name" : biz.name,
            "type" : biz.bizType,
            "adminId" : this.props.adminId
        }
    }

    render() {
       
        return (
            <div>       
                <div>     
                    <BizFormDialog 
                        openBizForm={this.props.openBizForm} 
                        error={this.state.error} 
                        styleClass={this.state.styleClass} 
                        handleBizSubmit={this.handleBizSubmit}
                        bizModel={this.props.bizModel}
                        handleClose={this.props.handleClose}
                        actionType={this.props.actionType}
                        adminId={this.props.adminId}
                    />          
                </div>        
            </div>
        );
    }
}
export default BizComponent;