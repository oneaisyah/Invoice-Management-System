import { Button } from "@mui/material";
import PaymentFormFields from "./PaymentFormFields";

const PaymentForm = ({
    recipientName,
    setRecipientName,
    amount,
    setAmount,
    dateOfPayment,
    setDateOfPayment,
    paid,
    setPaid,
    referenceNumber,
    setReferenceNumber,
    type,
    setType,
    handleSubmit
}) => {
    return (
        <form onSubmit={handleSubmit} >
            <PaymentFormFields
                recipientName={recipientName}
                setRecipientName={setRecipientName}
                amount={amount}
                setAmount={setAmount}
                dateOfPayment={dateOfPayment}
                setDateOfPayment={setDateOfPayment}
                paid={paid}
                setPaid={setPaid}
                referenceNumber={referenceNumber}
                setReferenceNumber={setReferenceNumber}
                type={type}
                setType={setType}
            />

            <Button type="submit" variant="contained" color="primary" id='payment-submit-button'>
                Submit
            </Button>
        </form>
    )
};
export default PaymentForm;