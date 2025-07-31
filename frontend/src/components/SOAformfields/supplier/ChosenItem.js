import React, { useEffect } from 'react'
import { Grid } from '@mui/material';

const ChosenSupplier = ({
    supplier
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                Name
            </Grid>
            <Grid item xs={12}>
                {supplier.name}
            </Grid>
            <Grid item xs={12}>
                Address
            </Grid>
            <Grid item xs={12}>
                {supplier.address}
            </Grid>
        </Grid>
    );
}
export default ChosenSupplier;