import React, { Component } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import CardActions from '@material-ui/core/CardActions';
import Typography from '@material-ui/core/Typography';
import { Button } from '@material-ui/core';
import '../../styles/Dashboard.css';

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

class Dashboard extends Component {
  constructor(props) {
     super(props);
  }
  
  editPerson = (updatePerson) => {
    this.props.getPersonFormData(updatePerson);
    this.props.viewProfile(true);
  } 

  createLogin = () => {
    
  }

  createPerson = () => {
    this.props.viewProfile(false);
  }

   render () {
      var classes = useStyles;
      return (
        <div className={classes.root}>
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
                  <Grid item xs={2}>
                    <Card className={classes.paper}>
                      <Typography>
                        Team Profiles
                      </Typography>
                      <CardActions>
                        <Button onClick={this.props.getPersonList}>View</Button>
                        <Button onClick={this.createPerson}>Add Profile</Button>
                        <Button onClick={this.createLogin}>Create Account</Button>
                      </CardActions>
                    </Card>
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  <Grid item xs={2}>
                    <Card className={classes.paper}>Time Entry</Card>
                  </Grid>
                  <Grid item xs={2}>
                    <Card className={classes.paper}>Team Time Entry</Card>
                  </Grid>
                </Grid>
            </Grid>
        </div>
      );
   }
}

export default Dashboard;