import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const FixedItemTable = () => {
    const [statementOfAccounts, setStatementOfAccounts] = useState([]);
    const [chosenStatementOfAccount, setChosenStatementOfAccount] = useState({});
    const [filter, setFilter] = useState({
        referenceNumber: null,
        supplier: null,
        paymentType: null,
        minDateOfPurchase: null,
        maxDateOfPurchase: null,
        minAmountOutstanding: null,
        maxAmountOutstanding: null,
        minAmountPaid: null,
        maxAmountPaid: null,
    })
    const columns = [
        { field: "_id", headerName: "No.", width: 100 },
        { field: "referenceNumber", headerName: "Reference Number", width: 200 },
        { field: "supplier", headerName: "Supplier", width: 200, valueGetter: (params) => params.row.supplier.name || "NA" },
        { field: "amountOutstanding", headerName: "Amount Outstanding", width: 200, valueGetter: (params) => params.row.amountOutstanding || 0 },
        { field: "amountPaid", headerName: "Amount Paid", width: 200, valueGetter: (params) => params.row.amountPaid || 0 },
        { field: "amountOverdue", headerName: "Amount Overdue", width: 200, valueGetter: (params) => params.row.amountOverdue || 0 }
    ];

    useEffect(() => {
        const fetchSOAData = async () => {
            try {
                console.log('fetchSOAData called');
                const currentFilter = {}
                const fields = Object.keys(filter);
                let empty = true;
                fields.forEach(field => {
                    if (filter[field]) {
                        currentFilter[field] = filter[field];
                        empty = false;
                    }
                });
                // if (empty) {
                //     setStatementOfAccounts([]);
                //     return;
                // }
                currentFilter.populate = true;
                const url = `http://localhost:8888/statement-of-account?${new URLSearchParams(currentFilter)}`;
                const response = await fetch(url);
                const data = await response.json();
                if (!response.ok) {
                    console.log('fetchSOAData error');

                    throw new Error('Failed to fetch invoice data');
                }
                console.log('in fetchSOA', data);

                const soaData = data.statementOfAccounts;
                setStatementOfAccounts(soaData);
            } catch (error) {
                console.error(error);
            }
        };
        console.log('useEffect in SOA FixedItemTable');
        fetchSOAData();
    }, [filter]);

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={statementOfAccounts}
                columns={columns}
                getRowId={(row) => row._id}
                onRowClick={(params) => setChosenStatementOfAccount(params.row)}
            />
        </div>
    );
};

export default FixedItemTable;
