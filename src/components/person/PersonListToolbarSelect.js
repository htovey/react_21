import React, {Component} from 'react';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { withStyles } from '@material-ui/styles';
import FetchUtil from '../../utils/FetchUtil';
import PersonComponent from './PersonComponent';
import CircularProgress from '@material-ui/core/CircularProgress';


const defaultToolbarSelectStyles = {
    iconButton: {
      marginRight: "24px",
      top: "40%",
      transform: "translateY(-50%)"
    },
    deleteIcon: {
      color: "#000"
    },
    editIcon: {
        color: "#000"
    },
    divHeight: {
        height: "40px"
    }
  };
  

class PersonListToolbarSelect extends Component {
    constructor(props) {
        super(props);
        this.state={
            loading: false
        }
    }

    handleDelete = () => {
        this.setState({loading: true});
        var url = "/delete";
        var body = this.getPersonIdList(this.props.selectedRows)
        var result = FetchUtil.handlePost(url, this.props.userToken, body)
        .then(response => {
            if (response.status === 200) {
                this.setState({loading : false});
                console.log("Delete: Success***");
                this.props.handleSuccess("delete");
                this.resetRows();
            }
        })
         
        .catch((error) => {
            console.log(error);
           // this.handleError('Delete failed. Please try again later.');
        });
    }

    editPerson = () => {
        var updatePerson = this.props.personList[this.props.selectedRows.data[0].index];
        this.props.getPersonFormData(updatePerson);
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

    resetRows = () => {
        this.props.setSelectedRows([]);
    //    this.setState({selectedRows: { data : []}});
    }

    render() {
        const { classes } = this.props;
        const multiSelect = this.props.selectedRows.data.length > 1;
     
        return (
            <div className={classes.divHeight} onChange={alert}>
                {this.state.loading && <CircularProgress/>} 
                <Tooltip title={"Edit"}>
                    <IconButton className={classes.iconButton} disabled={multiSelect} onClick={this.editPerson}>
                        {!multiSelect && <EditIcon className={classes.editIcon} />}
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Delete"}>
                    <IconButton className={classes.iconButton} onClick={this.handleDelete}>
                        <DeleteIcon className={classes.deleteIcon} />
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

export default withStyles(defaultToolbarSelectStyles, {
    name: "PersonListToolbarSelect"
})(PersonListToolbarSelect);

// export default PersonListToolbarSelect;