import React, {Component} from 'react';
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { withStyles } from '@material-ui/styles';
import FetchUtil from '../../utils/FetchUtil';
import PersonComponent from './PersonComponent';


const defaultToolbarStyles = {
    iconButton: {
      marginRight: "24px",
      top: "40%",
      transform: "translateY(-50%)"
    },
    divHeight: {
        height: "40px"
    }
  };
  

class PersonListToolbar extends Component {
    
    handleDelete = () => {
        var url = "/delete";
        var body = this.getPersonIdList(this.props.selectedRows)
        var result = FetchUtil.handlePost(url, this.props.userToken, body)
        .then(response => {
            if (response.status === 200) {
                console.log("Delete: Success***");
                this.props.handleSuccess();
            }
        })
         
        .catch((error) => {
            console.log(error);
           // this.handleError('Delete failed. Please try again later.');
        });
    }

    handleUpdate = () => {
        var url = "/person";
        var body = this.getPersonPayload(this.props.selectedRows)
        var result = FetchUtil.handlePost(url, this.props.userToken, body)
        .then(response => {
            if (response.status === 200) {
                console.log("Update: Success***");
                this.props.handleSuccess();
            }
        })
         
        .catch((error) => {
            console.log(error);
           // this.handleError('Delete failed. Please try again later.');
        });
    }

    editPerson = () => {
        console.log('stop here');
        var updatePerson = this.props.personList[this.props.selectedRows[0].index];
        //var updatePerson = this.props.personList[this.props.selectedRows.data[0].index];
        this.props.createUpdatePerson(updatePerson);
    }

    getPersonIdList = (selectedRows) => {
        var deleteArray = [];
        selectedRows.data.map((selectedPerson, index) => {
             var person =  this.props.personList[selectedPerson.index];
             deleteArray[index] = person.personId;
        });
        return deleteArray;
    }

    getPersonPayload = (person) => {
        var updatePerson = [];
        updatePerson.personId = person.personId;
        updatePerson.category = person.category;
        updatePerson.personText = person.personText;
        return updatePerson;
    }

    render() {
        const { classes } = this.props;
        var multiSelect = this.props.selectedRows.length > 1;
       // var multiSelect = false;
       // console.log("rows selected: "+this.props.selectedRows.length);
        return (
            <div className={classes.divHeight}>
                <Tooltip title="Add Person" aria-label="add">
                    <AddCircleIcon onClick={this.createUpdatePerson} style={{color: "white", width: "2em", height: "2em"}}/>
                </Tooltip>
                <Tooltip title={"Edit"}>
                    <IconButton className={classes.iconButton} disabled={multiSelect} onClick={this.editPerson}>
                        {!multiSelect && <EditIcon style={{color: "white", width: "2em", height: "2em"}} />}
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Delete"}>
                    <IconButton className={classes.iconButton} onClick={this.handleDelete}>
                        <DeleteIcon style={{color: "white", width: "2em", height: "2em"}} />
                    </IconButton>
                </Tooltip>
                {this.props.openPerson && <PersonComponent 
                    openPerson={true} 
                    personModel={this.updatePerson}
                    className="person"
                />  }
            </div>
        );
    }
}

export default withStyles(defaultToolbarStyles, {
    name: "PersonListToolbar"
})(PersonListToolbar);

// export default PersonListToolbarSelect;