import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Button, ButtonGroup, Card, CardContent } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import SOASearchFields from '../components/FilterFields/SOASearchFields';
import StatementOfAccount from '../components/apiWrapper/StatementOfAccount';

export default function SOADashboard() {
    const navigate = useNavigate();
    const [soaArray, setSoaArray] = useState([]);
    const [filter, setFilter] = useState({
        referenceNumber: null,
        supplier: {
            _id: '',
            name: '',
            address: '',
            uen: ''
        },
        minAmountOutstanding: null,
        maxAmountOutstanding: null,
        minAmountPaid: null,
        maxAmountPaid: null,
        minAmountOverdue: null,
        maxAmountOverdue: null,
        minDateIssued: null,
        maxDateIssued: null,
        minDateDue: null,
        maxDateDue: null
    });
    const [hideFilter, setHideFilter] = useState(true);
    const soaColumns = [
        { field: 'referenceNumber', headerName: 'Statement of Account ID', flex: 1, valueGetter: (params) => params.row.referenceNumber || 'NA' },
        { field: 'supplier', headerName: 'Supplier Name', width: 300, valueGetter: (params) => params.row.supplier.name || 'NA' },
        { field: 'amountOutstanding', headerName: 'Amount Outstanding', flex: 1, valueGetter: (params) => params.row.amountOutstanding || 'NA' },
        { field: 'amountOverdue', headerName: 'Amount Overdue', width: 300, valueGetter: (params) => params.row.amountOverdue }
    ];

    const generateFilter = () => {
        const currentFilter = {}
        const fields = Object.keys(filter);
        fields.forEach(field => {
            const idFields = ["supplier"];
            if (idFields.includes(field)) {
                if (filter[field]._id !== "")
                    currentFilter[field] = filter[field]._id;
            }
            else if (filter[field] !== null) {
                currentFilter[field] = filter[field]
            }
        });
        return currentFilter;
    }
    const handleSoaSearch = async () => {
        const currentFilter = generateFilter();
        if (!Object.keys(currentFilter))
            return;
        try {
            currentFilter.populate = true;
            const statementOfAccounts = await StatementOfAccount.getWithFilter(currentFilter);
            setSoaArray(statementOfAccounts);
        } catch (err) {
            console.error(err)
        }
    }
    // Clicking on a row will bring the user to the individual invoice page
    const handleRowClick = (params) => {

        const soaId = params.row._id;
        navigate(`/dashboard/statement-of-account/${soaId}`, { state: { statementOfAccount: params.row } });
    };
    const getSoaData = async () => {
        try {
            const filter = {
                populate: true
            }
            const data = await StatementOfAccount.getByFilter(filter);

            setSoaArray(data);

        } catch (error) {

            console.error('Error:', error);
        }
    }
    const handleHideFilter = () => {
        if (hideFilter)
            setHideFilter(false);
        else
            setHideFilter(true);
    }

    useEffect(() => {
        getSoaData();
    }, []);
    return (
        <Card className='soa-card'>
            <CardContent>
                <Grid container spacing={2} alignItems="center">
                    {/* Statement of Account Search */}
                    {!hideFilter ?
                        <Grid item xs={12}>
                            <SOASearchFields filter={filter} setFilter={setFilter} />
                        </Grid> : ""
                    }
                    <Grid item xs={6}>
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            {!hideFilter ?
                                <Button variant="outlined" onClick={getSoaData} id='soa-reset-button'>
                                    Reset
                                </Button>
                                : ""
                            }
                            {!hideFilter ?
                                <Button variant="contained" onClick={handleSoaSearch} id='soa-search-button'>
                                    Search
                                </Button>
                                : ""
                            }
                            {!hideFilter ?
                                <Button variant="contained" color="error" onClick={handleHideFilter} id='soa-cancel-button'>
                                    Cancel
                                </Button> :
                                <Button variant="outlined" onClick={handleHideFilter} id='soa-filter-button'>
                                    Filter
                                </Button>
                            }
                        </ButtonGroup>
                    </Grid>
                    <Grid item xs={12}>
                        {/* Statement of Account DataGrid */}
                        <DataGrid className='soa-table'
                            rows={soaArray}
                            columns={soaColumns}
                            onRowClick={handleRowClick}
                            getRowId={(row) => row._id}
                            pageSizeOptions={[5, 10, 25]}

                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}