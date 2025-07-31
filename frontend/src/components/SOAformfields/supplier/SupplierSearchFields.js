import { React, useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid } from '@mui/material';

const SupplierSearchFields = ({
    filter,
    setFilter,
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>

                <Typography variant="h6" >
                    Supplier Filters
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Name"
                    name="supplierName"
                    value={filter.name}
                    onChange={(e) => setFilter({ ...filter, name: e.target.value })}
                    fullWidth
                    margin="normal"
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Address"
                    name="supplierAddress"
                    value={filter.address}
                    onChange={(e) => setFilter({ ...filter, address: e.target.value })}
                    fullWidth
                    margin="normal"
                />
            </Grid>

        </Grid>
    )
}
export default SupplierSearchFields;