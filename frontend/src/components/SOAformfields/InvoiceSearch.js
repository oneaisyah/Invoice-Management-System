import { React, useState, useEffect } from 'react';
import { Button, ButtonGroup, Grid, Typography } from '@mui/material';
import InvoiceSearchFields from './invoice/InvoiceSearchFields';
import FixedItemTable from './invoice/FixedItemTable'
import ChosenItemTable from './invoice/ChosenItemTable';

const InvoiceSearch = ({ invoices, setInvoices }) => {
    const [filter, setFilter] = useState({
        invoiceID: null,
        paymentType: {
            _id: "",
            name: ""
        },
        supplier: {
            _id: "",
            name: "",
            address: "",
            uen: ""
        },
        minTotalPriceBeforeGST: null,
        maxTotalPriceAfterGSt: null,
        minDateOfPurchase: null,
        maxDateOfPurchase: null,
        paid: null
    })
    const [chosenInvoice, setChosenInvoice] = useState({});
    const [addingInvoice, setAddingInvoice] = useState(false);
    const handleAddClick = () => {
        setInvoices([...invoices, chosenInvoice]);
        alert(`Added invoice ${chosenInvoice.invoiceID} successfully!`);

    };
    const handleShowClick = () => {
        setAddingInvoice(!addingInvoice);
    };
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <Typography variant="h6" >
                    Chosen Invoices
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <ChosenItemTable invoices={invoices} setInvoices={setInvoices} />
            </Grid>
            {addingInvoice ?
                <Grid item xs={12}>
                    <InvoiceSearchFields filter={filter} setFilter={setFilter} />
                </Grid> : null}
            {addingInvoice ?
                <Grid item xs={12}>
                    <Typography variant="h6" >
                        Invoice Search Results
                    </Typography>
                </Grid> : null}
            {addingInvoice ?
                <Grid item xs={12}>
                    <FixedItemTable filter={filter} setChosenInvoice={setChosenInvoice} />
                </Grid> : null}
            <Grid item xs={3}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    {addingInvoice ?
                        <Button onClick={handleAddClick} variant="contained" id='add-invoice-button'> Add</Button>
                        : ""}
                    <Button onClick={handleShowClick} variant="outlined" id='add-cancel-invoice-button'>{addingInvoice ? "Cancel" : "Add Invoice"}</Button>
                </ButtonGroup>
            </Grid>
        </Grid >
    )
}
export default InvoiceSearch;