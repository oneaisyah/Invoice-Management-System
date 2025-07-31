
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Payment from '../../apiWrapper/Payment';

const FixedItemTable = ({ filter, setChosenPayment }) => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const currentFilter = {}
                const fields = Object.keys(filter);
                let empty = true;
                fields.forEach(field => {
                    if (filter[field]) {
                        currentFilter[field] = filter[field];
                        empty = false;
                    }
                });
                if (empty) {
                    setPayments([]);
                    return;
                }
                currentFilter.populate = true;
                const paymentData = await Payment.getWithFilter(currentFilter);
                setPayments(paymentData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPaymentData();
    }, [filter]);
    const columns = [
        { field: 'id', headerName: 'No.', width: 100 },
        { field: 'recipientName', headerName: 'Recipient Name', width: 200, valueGetter: (params) => params.row.recipientName || 'NA' },
        { field: 'referenceNumber', headerName: 'Reference Number', width: 200, valueGetter: (params) => params.row.referenceNumber || 'NA' },
        { field: 'amount', headerName: 'Amount', width: 150, valueGetter: (params) => params.row.amount || 'NA' },
        { field: 'type', headerName: 'Payment Type', width: 200, valueGetter: (params) => params.row.type?.name || 'NA' },
        { field: 'dateOfPayment', headerName: 'Date Of Payment', width: 200, valueGetter: (params) => params.row.dateOfPayment || '' },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                className='payment-table'
                rows={payments}
                columns={columns}
                getRowId={(row) => row._id}
                onRowClick={(params) => setChosenPayment(params.row)}
            />
        </div>
    );
};

export default FixedItemTable;
