
import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper } from '@mui/material';
import Supplier from '../../apiWrapper/Supplier';

const FixedItemTable = ({ filter, setChosenSupplier, setSupplierChosen }) => {
    const [suppliers, setSuppliers] = useState([]); // Corrected variable name to 'suppliers'

    useEffect(() => {
        const fetchSupplierData = async () => {
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
                    setSuppliers([]);
                    return;
                }
                const supplierData = await Supplier.getWithFilter(currentFilter);
                setSuppliers(supplierData);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSupplierData();
    }, [filter]);

    const columns = [
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'address', headerName: 'Address', width: 400 },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                className='supplier-table'
                rows={suppliers}
                columns={columns}
                getRowId={(row) => row._id}
                onRowClick={(params) => {
                    setChosenSupplier(params.row);
                    setSupplierChosen(true);
                }}
            />
        </div>
    );
};

export default FixedItemTable;
