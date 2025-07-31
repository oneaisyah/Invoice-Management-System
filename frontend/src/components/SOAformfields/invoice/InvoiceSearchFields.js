import { React, useState, useEffect } from 'react';
import { FormControlLabel, Typography, TextField, Checkbox, Grid } from '@mui/material';
import SupplierAutocomplete from '../../autocomplete/supplier';
import PaymentTypeAutocomplete from '../../autocomplete/paymentType';

const InvoiceSearchFields = ({
    filter,
    setFilter,
}) => {
    const setFilterSupplier = (newSupplier) => {
        setFilter({ ...filter, supplier: newSupplier });
    }
    const setFilterPaymentType = (newPaymentType) => {
        setFilter({ ...filter, paymentType: newPaymentType });
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>

                <Typography variant="h6" >
                    Invoice Filters
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Invoice ID"
                    value={filter.invoiceID}
                    onChange={(e) => setFilter({ ...filter, invoiceID: e.target.value })}
                    fullWidth
                    margin="normal"
                    name="invoiceIDSearch"
                />
            </Grid>
            <Grid item xs={6}>
                <SupplierAutocomplete supplier={filter.supplier} setSupplier={setFilterSupplier} />
            </Grid>
            <Grid item xs={6}>
                <PaymentTypeAutocomplete paymentType={filter.paymentType} setPaymentType={setFilterPaymentType} />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Min Date Of Purchase"
                    type="date"
                    value={filter.minDateOfPurchase}
                    onChange={(e) => setFilter({ ...filter, minDateOfPurchase: new Date(e.target.value) })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    name='minDateOfPurchaseSearch'
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Max Date Of Purchase"
                    type="date"
                    value={filter.maxDateOfPurchase}
                    onChange={(e) => setFilter({ ...filter, maxDateOfPurchase: new Date(e.target.value) })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    name='maxDateOfPurchaseSearch'
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Min Total Price Before GST"
                    type="number"
                    value={filter.minTotalPriceBeforeGST}
                    onChange={(e) => setFilter({ ...filter, minTotalPriceBeforeGST: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='minTotalPriceBeforeGSTSearch'
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Max Total Price Before GST"
                    type="number"
                    value={filter.maxTotalPriceBeforeGST}
                    onChange={(e) => setFilter({ ...filter, maxTotalPriceBeforeGST: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='maxTotalPriceBeforeGSTSearch'
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Min Total Price After GST"
                    type="number"
                    value={filter.minTotalPriceAfterGST}
                    onChange={(e) => setFilter({ ...filter, minTotalPriceAfterGST: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='minTotalPriceAfterGSTSearch'
                />
            </Grid>
            <Grid item xs={6}>
                <TextField
                    label="Max Total Price After GST"
                    type="number"
                    value={filter.maxTotalPriceAfterGST}
                    onChange={(e) => setFilter({ ...filter, maxTotalPriceAfterGST: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='maxTotalPriceAfterGSTSearch'
                />
            </Grid>
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={(e) => {
                                if (e.target.value === "on")
                                    setFilter({ ...filter, paid: true });
                                else
                                    setFilter({ ...filter, paid: false });
                            }} />
                    }
                    label="Paid"
                    name='paidSearch'
                />
                {/* <Checkbox
                    // checked={isPaid}
                    label="paid"
                /> */}
            </Grid>
        </Grid>
    )
}
export default InvoiceSearchFields;