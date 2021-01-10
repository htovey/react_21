import React, {Component} from 'react';
import IconButton from "@material-ui/core/IconButton";
import AddCircleIcon from '@material-ui/icons/AddCircle';
import Tooltip from "@material-ui/core/Tooltip";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { withStyles } from '@material-ui/styles';
import FetchUtil from '../../utils/FetchUtil';
import NoteComponent from './NoteComponent';


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
  

class NoteListToolbar extends Component {
    
    handleDelete = () => {
        var url = "/delete";
        var body = this.getNoteIdList(this.props.selectedRows)
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
        var url = "/note";
        var body = this.getNotePayload(this.props.selectedRows)
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

    editNote = () => {
        console.log('stop here');
        var updateNote = this.props.noteList[this.props.selectedRows[0].index];
        //var updateNote = this.props.noteList[this.props.selectedRows.data[0].index];
        this.props.createUpdateNote(updateNote);
    }

    getNoteIdList = (selectedRows) => {
        var deleteArray = [];
        selectedRows.data.map((selectedNote, index) => {
             var note =  this.props.noteList[selectedNote.index];
             deleteArray[index] = note.noteId;
        });
        return deleteArray;
    }

    getNotePayload = (note) => {
        var updateNote = [];
        updateNote.noteId = note.noteId;
        updateNote.category = note.category;
        updateNote.noteText = note.noteText;
        return updateNote;
    }

    render() {
        const { classes } = this.props;
        var multiSelect = this.props.selectedRows.length > 1;
       // var multiSelect = false;
       // console.log("rows selected: "+this.props.selectedRows.length);
        return (
            <div className={classes.divHeight}>
                <Tooltip title="Add Note" aria-label="add">
                    <AddCircleIcon onClick={this.createUpdateNote} style={{color: "white", width: "2em", height: "2em"}}/>
                </Tooltip>
                <Tooltip title={"Edit"}>
                    <IconButton className={classes.iconButton} disabled={multiSelect} onClick={this.editNote}>
                        {!multiSelect && <EditIcon style={{color: "white", width: "2em", height: "2em"}} />}
                    </IconButton>
                </Tooltip>
                <Tooltip title={"Delete"}>
                    <IconButton className={classes.iconButton} onClick={this.handleDelete}>
                        <DeleteIcon style={{color: "white", width: "2em", height: "2em"}} />
                    </IconButton>
                </Tooltip>
                {this.props.openNote && <NoteComponent 
                    openNote={true} 
                    noteModel={this.updateNote}
                    className="note"
                />  }
            </div>
        );
    }
}

export default withStyles(defaultToolbarStyles, {
    name: "NoteListToolbar"
})(NoteListToolbar);

// export default NoteListToolbarSelect;