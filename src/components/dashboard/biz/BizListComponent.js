import React from 'react';
import MUIDataTable from 'mui-datatables';
import BizListToolbarSelect from './BizListToolbarSelect';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import { StayPrimaryLandscape } from '@material-ui/icons';

export default function BizListComponent(props) {
    const columns = [
        {
            name: "id",
            label: "Biz Id",
            options: {
                display: 'excluded'
            }
        },
        {
            name: "type",
            label: "Type",
            options: {
                filter: true
            }
        },
        {
            name: "name",
            label: "Name",
            options: {
                filter: true,
                setCellProps: value => ({ style: { width: '75%' } }),
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
        onRowClick: props.bizRowClick,
        customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
            <BizListToolbarSelect 
                className={"selectToolbar"}
                selectedRows={selectedRows}
                bizList={props.bizList}
                getBizFormData={props.getBizFormData}
                userToken={props.userToken}
                handleSuccess={props.handleSuccess}
                setSelectedRows={setSelectedRows}
                displayData={displayData}/>
        )
      };

    const getMuiTheme = createMuiTheme({
        overrides: {
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
                //backgroundColor: 'red'
            }
        },
        });  
    

    return (
        <MuiThemeProvider theme={getMuiTheme}>
            <MUIDataTable 
                data={props.bizList}
                columns={columns}
                options={options}     
            />
        </MuiThemeProvider> 
    )
}