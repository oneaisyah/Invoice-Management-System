import { React, useState } from 'react';
import { Button, ButtonGroup, Grid, Typography } from '@mui/material';
import PaymentSearchFields from './payment/PaymentSearchFields';
import FixedItemTable from './payment/FixedItemTable'
import ChosenItemTable from './payment/ChosenItemTable';

const PaymentSearch = ({ payments, setPayments }) => {
    const [filter, setFilter] = useState({
        referenceNumber: null,
        recipientName: null,
        minamount: null,
        maxamount: null,
        mindateofpayment: null,
        maxdateofpayment: null
    })
    const [chosenPayment, setChosenPayment] = useState({});
    const [addingPayment, setAddingPayment] = useState(false);
    const handleAddClick = () => {
        setPayments([...payments, chosenPayment]);
        alert(`Added payment ${chosenPayment.referenceNumber} successfully!`);

    }
    const handleShowClick = () => {
        setAddingPayment(!addingPayment);
    }
    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h6" >
                    Chosen Payments
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <ChosenItemTable payments={payments} setPayments={setPayments} />
            </Grid>
            {addingPayment ?
                <Grid item xs={12}>
                    <PaymentSearchFields filter={filter} setFilter={setFilter} />
                </Grid> : null}
            {addingPayment ?
                <Grid item xs={12}>
                    <Typography variant="h6" >
                        Payment Results
                    </Typography>
                </Grid> : null}
            {addingPayment ?
                <Grid item xs={12}>
                    <FixedItemTable filter={filter} setChosenPayment={setChosenPayment} />
                </Grid> : null}
            {/* {addingPayment ?
                <Grid item xs={1.5}>
                    <Button onClick={handleAddClick} variant="contained"> Add</Button>
                </Grid> : null}

            <Grid item xs={3}>
                <Button onClick={handleShowClick} variant="contained">{addingPayment ? "Cancel" : "Add Payment"}</Button>
            </Grid> */}
            <Grid item xs={3}>
                <ButtonGroup variant="contained" aria-label="outlined primary button group">
                    {addingPayment ?
                        <Button onClick={handleAddClick} variant="contained"> Add</Button>
                        : ""}
                    <Button onClick={handleShowClick} variant="outlined" id='add-cancel-payment-button'>{addingPayment ? "Cancel" : "Add Payment"}</Button>
                </ButtonGroup>
            </Grid>
        </Grid >
    )
}
export default PaymentSearch