import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// @mui
import { ButtonGroup, Grid, Button, Card, CardContent, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircleOutline, WarningAmberRounded } from '@mui/icons-material';
import Invoice from '../components/apiWrapper/Invoice';
import InvoiceSearchFields from '../components/SOAformfields/invoice/InvoiceSearchFields';

export default function InvoiceDashboard() {
    const navigate = useNavigate();
    // Create an array for the invoice data
    const [invoiceArray, setInvoiceArray] = useState([]);
    const [filter, setFilter] = useState({
        invoiceID: null,
        paymentType: { _id: '', name: '' },
        supplier: { _id: '', name: '', address: '', uen: '' },
        minTotalPriceBeforeGST: null,
        maxTotalPriceAfterGSt: null,
        minDateOfPurchase: null,
        maxDateOfPurchase: null,
        paid: null
    });
    const [hideFilter, setHideFilter] = useState(true);
    const invoiceColumns = [
        {
            field: 'invoiceID', headerName: 'Invoice ID', flex: 1,
            valueGetter: (params) => params.row.invoiceID || 'NA'
        },
        {
            field: 'supplier', headerName: 'Supplier Name', width: 300,
            valueGetter: (params) => params.row.supplier ? params.row.supplier.name : 'NA'
        },
        {
            field: 'totalPriceAfterGST', headerName: 'Total Price After GST', flex: 1,
            valueGetter: (params) => params.row.totalPriceAfterGST || 'NA'
        },
        {
            field: 'paid', headerName: 'Paid',
            renderCell: (params) => {
                if (params.row.paid === true)
                    return <CheckCircleOutline style={{ color: 'green' }} />
                return <WarningAmberRounded style={{ color: 'red' }} />
            }
        }
    ];

    const generateFilter = () => {
        const currentFilter = {}
        const fields = Object.keys(filter);
        fields.forEach(field => {
            const idFields = ["supplier", "paymentType"];
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
    const handleInvoiceSearch = async () => {
        const currentFilter = generateFilter();
        if (!Object.keys(currentFilter))
            return;
        try {
            currentFilter.populate = true;
            const invoices = await Invoice.getWithFilter(currentFilter);
            setInvoiceArray(invoices);
        } catch (err) {
            console.error(err)
        }
    }
    // Clicking on a row will bring the user to the individual invoice page
    const handleRowClick = (params) => {

        const invoiceId = params.row._id;
        navigate(`/dashboard/invoice/${invoiceId}`, { state: { invoice: params.row } });
    };
    const handleHideFilter = () => {
        if (hideFilter)
            setHideFilter(false);
        else
            setHideFilter(true);
    }
    const getInvoiceData = async () => {
        try {
            const invoices = await Invoice.getAllPopulated();
            console.log("all invoices", invoices);
            setInvoiceArray(invoices);
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        getInvoiceData();
    }, []);

    return (
        <Card className='invoice-card'>
            <CardContent>
                <Grid container spacing={2}>
                    {!hideFilter ?
                        <Grid item xs={12}>
                            <InvoiceSearchFields filter={filter} setFilter={setFilter} />
                        </Grid> : ""
                    }
                    <Grid item xs={6}>
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            {!hideFilter ?
                                <Button variant="outlined" onClick={getInvoiceData} id='invoice-reset-button'>
                                    Reset
                                </Button>
                                : ""
                            }
                            {!hideFilter ?
                                <Button variant="contained" onClick={handleInvoiceSearch} id='invoice-search-button'>
                                    Search
                                </Button>
                                : ""
                            }
                            {!hideFilter ?
                                <Button variant="contained" color="error" onClick={handleHideFilter} id='invoice-cancel-button'>
                                    Cancel
                                </Button> :
                                <Button variant="outlined" onClick={handleHideFilter} id='invoice-filter-button' >
                                    Filter
                                </Button>
                            }
                        </ButtonGroup>
                    </Grid>

                    <Grid item xs={12}>
                        <DataGrid className='invoice-table'
                            rows={invoiceArray}
                            columns={invoiceColumns}
                            onRowClick={handleRowClick}
                            getRowId={(row) => row._id}
                            pageSizeOptions={[5, 10, 25]}
                        />
                    </Grid>
                </Grid>

            </CardContent>
        </Card>
    );
};