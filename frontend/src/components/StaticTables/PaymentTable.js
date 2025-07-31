
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const PaymentTable = (payments) => {


    const columns = [
        { field: 'id', headerName: 'No.', width: 100 },
        { field: 'recipientName', headerName: 'Recipient Name', width: 200, valueGetter: (params) => params.row.recipientName || 'NA' },
        { field: 'referenceNumber', headerName: 'Reference Number', width: 200, valueGetter: (params) => params.row.referenceNumber || 'NA' },
        { field: 'amount', headerName: 'Amount', width: 150, valueGetter: (params) => params.row.amount || 'NA' },
        { field: 'type', headerName: 'Payment Type', width: 200, valueGetter: (params) => params.row.type?.name || 'NA' },
        { field: 'dateOfPayment', headerName: 'Date Of Payment', width: 200, valueGetter: (params) => params.row.dateOfPayment || 'NA' },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={payments}
                columns={columns}
                getRowId={(row) => row._id}
            />
        </div>
    );
};

export default PaymentTable;
