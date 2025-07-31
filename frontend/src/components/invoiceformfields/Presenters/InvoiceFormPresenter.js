import { React, useEffect, useState } from 'react';
import { Grid, TextField, Typography, FormControlLabel, Checkbox, Button } from '@mui/material';

import ProductPopup from '../../popups/ProductPopup';
import SupplierPopup from '../../popups/SupplierPopup';

import PaymentTypeAutocomplete from '../../autocomplete/paymentType';
import SupplierAutocomplete from '../../autocomplete/supplier';

import ItemTable from '../ItemTable';

const InvoiceFormPresenter = ({
    invoiceId,
    handleInvoiceId,
    supplier,
    setSupplier,
    addingSupplier,
    handleAddingSupplier,
    setNewSupplier,
    itemsData,
    setItemsData,
    itemTableFilled,
    setItemTableFilled,
    addingProduct,
    handleAddingProduct,
    total,
    purchaseDate,
    handlePurchaseDate,
    paymentType,
    setPaymentType,
    isPaid,
    handleIsPaid,
    totalPriceBeforeGst,
    handleTotalPriceBeforeGst,
    totalPriceAfterGst,
    handleTotalPriceAfterGst,
    fileLink,
    handleSubmit
}) => {
    return (
        <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="Invoice ID"
                        value={invoiceId}
                        onChange={handleInvoiceId}
                        fullWidth
                        margin="normal"
                        inputProps={{ 'data-testid': 'invoice-id-input' }}
                    />
                </Grid>
                {
                    addingSupplier ?
                        <Grid item xs={12}>

                            <SupplierPopup setShow={handleAddingSupplier} setSupplier={setNewSupplier} />
                        </Grid >
                        :
                        <Grid item xs={12}>
                            <SupplierAutocomplete
                                supplier={supplier} setSupplier={setSupplier} />
                            <Button onClick={handleAddingSupplier} id='new-supplier-button'>New Supplier</Button>
                        </Grid>
                }
                <Grid item xs={12}>
                    <ItemTable
                        itemsData={itemsData}
                        setItemsData={setItemsData}
                        itemTableFilled={itemTableFilled}
                        setItemTableFilled={setItemTableFilled}
                    />
                </Grid >
                <Grid item xs={12}>
                    <Typography variant="h6">
                        total:{` ${itemTableFilled ? total : 'Update Items First'}`}
                    </Typography>
                </Grid >

                {
                    addingProduct ?
                        <Grid item xs={12}>
                            <ProductPopup setShow={handleAddingProduct} />
                        </Grid >
                        :
                        <Grid item xs={12}>
                            <Button onClick={handleAddingProduct} id='new-product-button'>New Product</Button>
                        </Grid >
                }
                <Grid item xs={12}>

                    <TextField
                        label="Date of Purchase"
                        type="date"
                        value={purchaseDate}
                        onChange={handlePurchaseDate}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ 'data-testid': 'date-of-purchase-input' }}
                    />
                </Grid >
                <Grid item xs={12}>

                    <PaymentTypeAutocomplete paymentType={paymentType} setPaymentType={setPaymentType} />
                </Grid >
                <Grid item xs={12}>

                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={isPaid}
                                onChange={handleIsPaid}
                            />
                        }
                        label="Paid"
                        inputProps={{ 'data-testid': 'paid-input' }}
                    />
                </Grid >
                <Grid item xs={12}>

                    <TextField
                        label="Total Price Before GST"
                        value={totalPriceBeforeGst}
                        onChange={handleTotalPriceBeforeGst}
                        fullWidth
                        margin="normal"
                        inputProps={{ 'data-testid': 'total-price-before-gst-input' }}
                    />
                </Grid >
                <Grid item xs={12}>

                    <TextField
                        label="Total Price After GST"
                        value={totalPriceAfterGst}
                        onChange={handleTotalPriceAfterGst}
                        fullWidth
                        margin="normal"
                        inputProps={{ 'data-testid': 'total-price-after-gst-input' }}
                    />
                </Grid >
                <Grid item xs={12}>

                    <TextField
                        label="File link"
                        value={fileLink}
                        fullWidth
                        margin="normal"
                        disabled
                    />
                </Grid >
                <Grid item xs={12}>

                    <Button type="submit" variant="contained" color="primary" id="invoice-submit-button">
                        Submit
                    </Button>
                </Grid >

            </Grid>
        </form >
    );
}
export default InvoiceFormPresenter;