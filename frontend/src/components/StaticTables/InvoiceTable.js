
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const InvoiceTable = (invoices) => {
    const invoiceColumns = [
        { field: 'invoiceID', headerName: 'Invoice ID', flex: 1, valueGetter: (params) => params.row.invoiceID || 'NA' },
        { field: 'supplier', headerName: 'Supplier Name', width: 300, valueGetter: (params) => params.row.supplier ? params.row.supplier.name : 'NA' },
        { field: 'totalPriceAfterGST', headerName: 'Total Price After GST', flex: 1, valueGetter: (params) => params.row.totalPriceAfterGST || 'NA' },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={invoices}
                columns={invoiceColumns}
                getRowId={(row) => row._id}
                onRowClick={() => { console.log('clicked') }}
            />
        </div>
    );
};

export default InvoiceTable;
