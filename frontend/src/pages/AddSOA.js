import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

import { Helmet } from 'react-helmet-async';
import { Grid, Container, Typography, Card, CardContent } from '@mui/material';
import SOAForm from '../components/SOAformfields/SOAForm';
import SOAUploaderContainer from '../components/FileProcesses/SOA/SOAUploaderContainer';
import StatementOfAccount from '../components/apiWrapper/StatementOfAccount';
// Define the columns for the DataGrid

export default function AddSOA() {

  const [referenceNumber, setReferenceNumber] = useState('');
  const [invoices, setInvoices] = useState([]);
  const [payments, setPayments] = useState([]);
  const [dateIssued, setDateIssued] = useState('');
  const [dateDue, setDateDue] = useState(''); // Initialize with an empty string
  const [supplier, setSupplier] = useState('');
  const [amountOutstanding, setAmountOutstanding] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [amountOverdue, setAmountOverdue] = useState('');

  const [fileLink, setFileLink] = useState('');
  const handleSubmit = async (event) => {
    event.preventDefault();
    // Convert the dateDue to ISO 8601 format before sending it in the POST request
    const data = {
      referenceNumber,
      invoices: invoices.map(invoice => invoice._id),
      payments: payments.map(payment => payment._id),
      dateIssued: new Date(dateIssued),
      dateDue: new Date(dateDue),
      supplier: supplier._id,
      amountOutstanding,
      amountPaid,
      amountOverdue,
      imageLink: fileLink, // Include the image link in the data sent to the server
    };
    console.log('Data sent to server:', data);

    try {
      await StatementOfAccount.post(data);
      toast.success('Statement of account added successfully!', {
        duration: 2000,
        className: "add-soa-success-toast"
      });
    } catch (error) {
      toast.error("Please fill in all fields correctly.", {
        duration: 7000,
        className: "add-soa-failure-toast"
      });
      console.error(error);
      // Handle error or show error message to the user
    }
  };

  return (
    <>
      <Helmet>
        <title>Add SOA</title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Add SOA
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={6}>
            <Card>
              <CardContent>
                <SOAForm
                  referenceNumber={referenceNumber}
                  setReferenceNumber={setReferenceNumber}
                  invoices={invoices}
                  setInvoices={setInvoices}
                  payments={payments}
                  setPayments={setPayments}
                  dateIssued={dateIssued}
                  setDateIssued={setDateIssued}
                  dateDue={dateDue}
                  setDateDue={setDateDue}
                  supplier={supplier}
                  setSupplier={setSupplier}
                  amountOutstanding={amountOutstanding}
                  setAmountOutstanding={setAmountOutstanding}
                  amountPaid={amountPaid}
                  setAmountPaid={setAmountPaid}
                  amountOverdue={amountOverdue}
                  setAmountOverdue={setAmountOverdue}
                  fileLink={fileLink}
                  handleSubmit={handleSubmit}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>

            <SOAUploaderContainer
              fileLink={fileLink}
              setFileLink={setFileLink} />
          </Grid>

        </Grid>
      </Container>
    </>
  );
}