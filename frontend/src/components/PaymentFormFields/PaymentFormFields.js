import { React, useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';

import PaymentTypeAutocomplete from '../autocomplete/paymentType';


const PaymentFormFields = ({
    amount,
    setAmount,
    type,
    setType,
    dateOfPayment,
    setDateOfPayment,
    referenceNumber,
    setReferenceNumber,
    recipientName,
    setRecipientName
}) => {

    return (
        <>
            <TextField
                label="Recipient Name"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                fullWidth
                margin="normal"
                name='payment-recipient-name'
            />
            <TextField
                label="Reference Number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                name='payment-reference-number'
            />
            <TextField
                label="dateOfPayment"
                type="date"
                value={dateOfPayment}
                onChange={(e) => setDateOfPayment(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
                name='payment-date-of-payment'
            />

            <PaymentTypeAutocomplete paymentType={type} setPaymentType={setType} />

            <TextField
                label="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                fullWidth
                margin="normal"
                name='payment-amount'
            />
        </>
    );
};

export default PaymentFormFields;