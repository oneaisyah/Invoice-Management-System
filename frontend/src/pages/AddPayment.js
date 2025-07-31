import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Card, CardContent, IconButton } from '@mui/material';
import PaymentForm from '../components/PaymentFormFields/PaymentForm';
import Payment from '../components/apiWrapper/Payment';
// ----------------------------------------------------------------------

export default function AddPaymentPage() {

    const [dateOfPayment, setDateOfPayment] = useState('');
    const [type, setType] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [amount, setAmount] = useState('');
    const [referenceNumber, setReferenceNumber] = useState('');


    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            dateOfPayment,
            type: type._id,
            recipientName,
            amount,
            referenceNumber
        };
        try {
            console.log('posted data', data);
            await Payment.post(data);
            toast.success('Payment added successfully', {
                duration: 3000,
                className: 'payment-add-success-toast',
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to add payment.', {
                duration: 3000,
                className: 'payment-add-failure-toast',
            });
            // Handle error or show error message to the user
        }
    };

    return (
        <>
            <Helmet>
                <title> Add Payment </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Add Payment
                </Typography>

                <Grid container spacing={3}>

                    <Grid item xs={24} sm={12} md={6}>
                        <Card>
                            <CardContent>
                                <PaymentForm
                                    dateOfPayment={dateOfPayment}
                                    setDateOfPayment={setDateOfPayment}
                                    type={type}
                                    setType={setType}
                                    recipientName={recipientName}
                                    setRecipientName={setRecipientName}
                                    amount={amount}
                                    setAmount={setAmount}
                                    referenceNumber={referenceNumber}
                                    setReferenceNumber={setReferenceNumber}
                                    handleSubmit={handleSubmit}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            </Container>
        </>
    );
}