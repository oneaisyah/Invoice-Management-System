import { React, useState, useEffect } from 'react';
import { Typography, TextField, Button, Grid } from '@mui/material';

const PaymentSearchFields = ({
    filter,
    setFilter,
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>

                <Typography variant="h6" >
                    Payment Filters
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Recipient Name"
                    value={filter.recipientName}
                    onChange={(e) => setFilter({ ...filter, recipientName: e.target.value })}
                    fullWidth
                    margin="normal"
                    name="payment-recipient-name"
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Reference Number"
                    value={filter.referenceNumber}
                    onChange={(e) => setFilter({ ...filter, referenceNumber: e.target.value })}
                    fullWidth
                    margin="normal"
                    name="payment-reference-number"
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Min Date Of Payment"
                    type="date"
                    value={filter.minDateOfPayment}
                    onChange={(e) => setFilter({ ...filter, minDateOfPayment: new Date(e.target.value) })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    name='payment-min-date-of-payment'
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Max Date Of Payment"
                    type="date"
                    value={filter.maxDateOfPayment}
                    onChange={(e) => setFilter({ ...filter, maxDateOfPayment: new Date(e.target.value) })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    name='payment-max-date-of-payment'
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Min Amount"
                    type="number"
                    value={filter.minAmount}
                    onChange={(e) => setFilter({ ...filter, minAmount: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='payment-min-amount'
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Max Amount"
                    type="number"
                    value={filter.maxAmount}
                    onChange={(e) => setFilter({ ...filter, maxAmount: e.target.value })}
                    fullWidth
                    margin="normal"
                    name="payment-max-amount"
                />
            </Grid>
            <Grid item xs={4}>
                <TextField
                    label="payment type"
                    value={filter.type}
                    onChange={(e) => setFilter({ ...filter, type: e.target.value })}
                    fullWidth
                    margin="normal"
                    name="payment-payment-type"
                />
            </Grid>

        </Grid>
    )
}
export default PaymentSearchFields;