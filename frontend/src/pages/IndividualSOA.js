import { React, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ButtonGroup, Container, Typography, TextField, Grid, Button } from '@mui/material';
import { format } from 'date-fns';
import { DataGrid } from '@mui/x-data-grid';
import { CheckCircleOutline } from '@mui/icons-material';
import toast, { ErrorIcon } from 'react-hot-toast';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import StatementOfAccount from '../components/apiWrapper/StatementOfAccount';

const IndividualSOA = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [statementOfAccount, setStatementOfAccount] = useState(location.state.statementOfAccount);

    const invoiceColumns = [
        { field: 'invoiceID', headerName: 'Invoice ID', flex: 1, valueGetter: (params) => params.row.invoiceID || 'NA' },
        { field: 'supplier', headerName: 'Supplier Name', width: 300, valueGetter: () => statementOfAccount.supplier ? statementOfAccount.supplier.name : 'NA' },
        { field: 'totalPriceAfterGST', headerName: 'Total Price After GST', flex: 1, valueGetter: (params) => params.row.totalPriceAfterGST || 'NA' },
        { field: 'paid', headerName: 'Paid', flex: 1, renderCell: (params) => params.row.paid ? <CheckCircleOutline style={{ color: 'green' }} /> : <ErrorIcon style={{ color: 'red' }} /> }

    ];
    const paymentColumns = [
        { field: 'recipientName', headerName: 'Recipient Name', width: 200, valueGetter: (params) => params.row.recipientName || 'NA' },
        { field: 'referenceNumber', headerName: 'Reference Number', width: 200, valueGetter: (params) => params.row.referenceNumber || 'NA' },
        { field: 'amount', headerName: 'Amount', width: 150, valueGetter: (params) => params.row.amount || 'NA' },
        { field: 'type', headerName: 'Payment Type', width: 200, valueGetter: (params) => params.row.type?.name || 'NA' },
        { field: 'dateOfPayment', headerName: 'Date Of Payment', width: 200, valueGetter: (params) => params.row.dateOfPayment || 'NA' },
    ];
    const handleRowClick = (params) => {
        const invoiceId = params.row._id;
        navigate(`/dashboard/invoice/${invoiceId}`, { state: { invoice: params.row } });
    };
    return (
        <>
            <Container maxWidth="xl">
                <Grid container >
                    <Grid item xs={9.7}>
                        <Typography variant="h4" sx={{ mb: 5 }} id='soa-title'>
                            Reference Number: {statementOfAccount.referenceNumber}
                        </Typography>
                    </Grid>
                    <Grid item xs={2.3} >
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                            <Button variant="contained" id='export-soa-button'
                                endIcon={<FileDownloadIcon />} onClick={() => StatementOfAccount.getCsv(statementOfAccount.referenceNumber)}>
                                Export to CSV
                            </Button>
                            <Button color="error" variant="contained" id='delete-soa-button'
                                endIcon={<DeleteIcon />} onClick={ async () => {
                                    await StatementOfAccount.delete(statementOfAccount._id);
                                    toast.success('Statement of Account deleted successfully!', {
                                        duration: 5000,
                                        className: 'delete-soa-success-toast',
                                    });
                                    setTimeout(() => {
                                        window.location.href = '/dashboard/app'
                                    }, 2000);
                                }}>
                                Delete
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>

                <form>
                    <TextField
                        label="Reference Number"
                        value={statementOfAccount.referenceNumber}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Supplier"
                        value={statementOfAccount.supplier.name}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Date Issued"
                        value={format(new Date(statementOfAccount.dateIssued), 'dd/MM/yyyy')}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Date Due"
                        value={format(new Date(statementOfAccount.dateDue), 'dd/MM/yyyy')}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    {statementOfAccount.invoices.length ?
                        <DataGrid
                            rows={statementOfAccount.invoices}
                            columns={invoiceColumns}
                            onRowClick={handleRowClick}
                            getRowId={(row) => {
                                if (row._id)
                                    return row._id;
                                return Math.floor(Math.random() * 10000);
                            }}
                        /> : ""
                    }
                    <DataGrid
                        rows={statementOfAccount.payments}
                        columns={paymentColumns}
                        getRowId={(row) => {
                            if (row._id)
                                return row._id;
                            return Math.floor(Math.random() * 10000);
                        }}
                    />
                    <TextField
                        label="Amount Outstanding"
                        value={statementOfAccount.amountOutstanding}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Amount Paid"
                        value={statementOfAccount.amountPaid}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Amount Overdue"
                        value={statementOfAccount.amountOverdue}
                        InputProps={{ readOnly: true }}
                        fullWidth
                        margin="normal"
                    />
                </form>
            </Container>
        </>
    )
}

export default IndividualSOA