import React from 'react';
import MUIDataTable from 'mui-datatables';
import PersonListToolbarSelect from './PersonListToolbarSelect';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { StayPrimaryLandscape } from '@material-ui/icons';
import PersonListToolbar from './PersonListToolbar';

export default function PersonListComponent(props) {
    const columns = [
        {
            name: "id",
            label: "ID",
            options: {
                display: 'excluded'
            }
        },
        {
            name: "userName",
            label: "User Name",
            options: {
                filter: true
            }
        },
        {
            name: "fName",
            label: "First Name",
            options: {
                filter: true
            }
        },
        {
            name: "lName",
            label: "Last Name",
            options: {
                filter: true,
                //setCellProps: value => ({ style: { width: '75%' } }),
            }
        },
        {
            name: "saveDate",
            label: "Last Updated",
            options: {
                filter: true
            }
        }
    ];

    const options = {
        filter: true,
        filterType: "dropdown",
        responsive: "vertical",
        selectableRows: true,
        selectToolbarPlacement: "above",
        onRowClick: props.getPersonFormData,
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <PersonListToolbarSelect 
                className={"selectToolbar"}
                selectedRows={selectedRows}
                personList={props.personList}
                editPerson={props.editPerson}
                getPersonFormData={props.getPersonFormData}
                userToken={props.userToken}
                handleSuccess={props.handleSuccess}
                setSelectedRows={setSelectedRows}
                displayData={displayData}/>
        )
      };

    const getMuiTheme = createMuiTheme({
        overrides: {
            MUIDataTable: {
            root: {
                backgroundColor: 'purple',
            },
            
            paper: {
                boxShadow: '2px',
            },
            },
            MUIDataTableToolbarSelect: {
               root: {
                    backgroundColor: 'orange',
               },
            },
            MuiTableCell: {
            head: {
                backgroundColor: 'purple',
            },
            },
            MUIDataTableSelectCell: {
            headerCell: {
                backgroundColor: 'inherit',
            },
            },
            MuiTableFooter: {
            root: {
                '& .MuiToolbar-root': {
                backgroundColor: 'white',
                },
            },
            },
            MuiPaper: {
                backgroundColor: 'red'
            }
        },
        });  
    

    return (
        <MuiThemeProvider theme={getMuiTheme}>
            <MUIDataTable 
                data={props.personList}
                columns={columns}
                options={options}     
            />
        </MuiThemeProvider> 
    )
}