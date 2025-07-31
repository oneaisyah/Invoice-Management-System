import { React, useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';



const ProductFormFields = ({
    name,
    setName,
    upc,
    setUpc
}) => {
    return (
        <>
            <TextField
                label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                margin="normal"
                name='product-name'
            />
            <TextField
                label="UPC"
                value={upc}
                onChange={(e) => setUpc(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                name='product-upc'
            />
        </>
    );
};

export default ProductFormFields;