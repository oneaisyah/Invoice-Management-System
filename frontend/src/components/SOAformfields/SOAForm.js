import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import PaymentSearch from './PaymentSearch';
import InvoiceSearch from './InvoiceSearch';
import SupplierSearch from './SupplierSearch';
import PaymentPopup from '../popups/PaymentPopup';

const SOAForm = ({
  referenceNumber,
  setReferenceNumber,
  invoices,
  setInvoices,
  payments,
  setPayments,
  dateIssued,
  setDateIssued,
  dateDue,
  setDateDue,
  supplier,
  setSupplier,
  amountOutstanding,
  setAmountOutstanding,
  amountPaid,
  setAmountPaid,
  amountOverdue,
  setAmountOverdue,
  fileLink, // Add imageLink and setImageLink props
  handleSubmit
}) => {
  // ... The useEffect for fetching supplier and payment type data remains the same ...
  const [addingPayment, setAddingPayment] = useState(false);
  const [newPayment, setNewPayment] = useState(null);

  const handleAddingPayment = () => {
    setAddingPayment(true);
  }
  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>

          <Card variant="outlined">
            <CardContent>
              <TextField
                name="referenceNumber"
                label="Reference Number"
                value={referenceNumber}
                onChange={(e) => setReferenceNumber(e.target.value)}
                fullWidth
                margin="normal"
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <SupplierSearch supplier={supplier} setSupplier={setSupplier} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>

          <Card variant="outlined">
            <CardContent>

              {
                addingPayment ?
                  <PaymentPopup setShow={setAddingPayment} setPayment={handleAddingPayment} />
                  :
                  <>
                    <PaymentSearch payments={payments} setPayments={setPayments} />
                    <Button onClick={handleAddingPayment} variant="contained" id='new-payment-button'>New Payment</Button>

                  </>
              }

            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <InvoiceSearch invoices={invoices} setInvoices={setInvoices} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <TextField
                name="dateIssued"
                label="Date Issued"
                type="date"
                value={dateIssued}
                onChange={(e) => setDateIssued(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                name="dateDue"
                label="Date Due"
                type="date"
                value={dateDue}
                onChange={(e) => setDateDue(e.target.value)}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                name='amountOutstanding'
                label="Amount Outstanding"
                value={amountOutstanding}
                onChange={(e) => setAmountOutstanding(e.target.value)}
                fullWidth
                margin="normal"
              />

              <TextField
                name='amountPaid'
                label="Amount Paid"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                fullWidth
                margin="normal"
              />

              <TextField
                name='amountOverdue'
                label="Amount Overdue"
                value={amountOverdue}
                onChange={(e) => setAmountOverdue(e.target.value)}
                fullWidth
                margin="normal"
              />

              <TextField
                label="Image Link" // Add a text field for the image link
                value={fileLink}
                fullWidth
                disabled
                margin="normal"
              />

            </CardContent>
          </Card>

        </Grid>
        <Grid item xs={12}>

          <Button type="submit" variant="contained" color="primary">
            Submit
          </Button>
        </Grid>

      </Grid >
    </form>
  );
};

export default SOAForm;
