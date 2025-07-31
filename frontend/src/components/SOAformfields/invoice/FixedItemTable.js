import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Invoice from '../../apiWrapper/Invoice';

const FixedItemTable = ({ filter, setChosenInvoice }) => {
    const [invoices, setInvoices] = useState([]);
    const columns = [
        { field: "invoiceID", headerName: "Invoice ID", width: 140 },
        { field: "supplier", headerName: "Supplier", width: 100, valueGetter: (params) => params.row.supplier?.name || "NA" },
        { field: "paymentType", headerName: "Payment Type", width: 100, valueGetter: (params) => (params.row.paymentType ? params.row.paymentType.name : null) || "NA" },
        { field: "totalPriceAfterGST", headerName: "Total Price After GST", width: 100, valueGetter: (params) => params.row.totalPriceAfterGST || "NA" },
        { field: "dateOfPurchase", headerName: "Date Of Purchase", width: 100, valueGetter: (params) => params.row.dateOfPurchase || "" },
        { field: "paid", headerName: "Paid", width: 100, valueGetter: (params) => params.row.paid || false },
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
    useEffect(() => {
        const fetchInvoiceData = async () => {
            const currentFilter = generateFilter();
            if (!Object.keys(currentFilter))
                return;
            try {
                currentFilter.populate = true;
                const invoices = await Invoice.getWithFilter(currentFilter);
                setInvoices(invoices);
            } catch (err) {
                console.error(err)
            }
        };

        fetchInvoiceData();
    }, [filter]);
    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                className='invoice-table'
                rows={invoices}
                columns={columns}
                getRowId={(row) => row._id}
                onRowClick={(params) => setChosenInvoice(params.row)}
            />
        </div>
    );
};

export default FixedItemTable;
