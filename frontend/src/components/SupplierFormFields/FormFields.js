import { React, useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';



const SupplierFormFields = ({
    name,
    setName,
    address,
    setAddress,
    uen,
    setUen,
}) => {
    return (
        <>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                name='supplier-name'
            />
            <TextField
                label="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                name='supplier-address'
            />
            <TextField
                label="UEN"
                value={uen}
                onChange={(e) => setUen(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                name='supplier-uen'
            />
        </>
    );
};

export default SupplierFormFields;