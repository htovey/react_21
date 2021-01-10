import React from 'react';
import MUIDataTable from 'mui-datatables';
import PersonListToolbarSelect from './PersonListToolbarSelect';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { StayPrimaryLandscape } from '@material-ui/icons';
import PersonListToolbar from './PersonListToolbar';

export default function PersonListComponent(props) {
    const columns = [
        {
            name: "personId",
            label: "Person Id",
            options: {
                display: 'excluded'
            }
        },
        {
            name: "category",
            label: "Category",
            options: {
                filter: true
            }
        },
        {
            name: "personText",
            label: "Person",
            options: {
                filter: true,
                setCellProps: value => ({ style: { width: '75%' } }),
            }
        },
        {
            name: "lastUpdated",
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
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <PersonListToolbarSelect 
                className={"selectToolbar"}
                selectedRows={selectedRows}
                personList={props.persons}
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
                boxShadow: 'none',
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
                data={props.persons}
                columns={columns}
                options={options}     
            />
        </MuiThemeProvider> 
    )
}