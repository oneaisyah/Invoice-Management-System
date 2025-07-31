import { useState } from 'react';
import { Button, Card, CardContent, Typography } from '@mui/material';

import Payment from '../apiWrapper/Payment';
import PaymentFormFields from '../PaymentFormFields/PaymentFormFields';

const PaymentPopup = ({
    setShow,
    setPayment,
}) => {
    const [referenceNumber, setReferenceNumber] = useState('');
    const [recipientName, setRecipientName] = useState('');
    const [amount, setAmount] = useState(0)
    const [type, setType] = useState(null);
    const [dateOfPayment, setDateOfPayment] = useState('');
    const handleAdd = async (event) => {
        event.preventDefault();
        const data = {
            referenceNumber,
            recipientName,
            amount,
            type: type._id,
            dateOfPayment
        };
        try {
            const postedPayment = await Payment.post(data);
            if (setPayment)
                setPayment(postedPayment);
            setShow(false);
        } catch (err) {
            console.error(err);
        }
    };
    const handleCancel = () => {
        setShow(false)
    }
    return (
        <Card variant="outlined" style={{ margin: '10px' }}>
            <CardContent>
                <Typography variant="h6">New Payment</Typography>
            </CardContent>
            <CardContent>
                <PaymentFormFields
                    referenceNumber={referenceNumber}
                    setReferenceNumber={setReferenceNumber}
                    recipientName={recipientName}
                    setRecipientName={setRecipientName}
                    amount={amount}
                    setAmount={setAmount}
                    type={type}
                    setType={setType}
                    dateOfPayment={dateOfPayment}
                    setDateOfPayment={setDateOfPayment}
                />
            </CardContent>
            <Button onClick={handleAdd} id='create-payment-button'>Create</Button>
            <Button onClick={handleCancel}>Cancel</Button>
        </Card>
    )
};
export default PaymentPopup;