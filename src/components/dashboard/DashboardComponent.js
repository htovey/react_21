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
       openBiz: false
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

   render () {
      var classes = useStyles;
      return (
        <div className={classes.root}>
          {this.state.loginModel.roleType === 'SUPER' && 
            <BizDashboardComponent
              loginModel={this.state.loginModel}
              //bizModel={this.state.bizModel}
              adminId={this.props.adminId}
              userToken={this.props.userToken}
              handleSubmit={this.props.handleSubmit}
              togglePerson={this.props.togglePerson}
            />}
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
                        <Button onClick={this.props.getPersonList}>View</Button>
                        <Button onClick={this.props.togglePerson}>Add Profile</Button>
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
            </Grid>
        </div>
      );
   }
}

export default DashboardComponent;