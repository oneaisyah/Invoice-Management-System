import { React, useState, useEffect } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import PaymentType from '../apiWrapper/PaymentType';

const PaymentTypeAutocomplete = ({
    paymentType,
    setPaymentType
}) => {
    // Supplier
    const [paymentTypesList, setPaymentTypesList] = useState([]);
    const [paymentTypeInput, setPaymentTypeInput] = useState('');
    useEffect(() => {
        if (paymentType?.name)
            setPaymentTypeInput(paymentType.name);
    }, [paymentType])
    useEffect(() => {
        const fetchPaymentTypes = async () => {
            try {
                if (paymentTypeInput === '')
                    return;
                const filter = { name: paymentTypeInput };
                const paymentTypes = await PaymentType.getWithFilter(filter);
                setPaymentTypesList(paymentTypes);
            } catch (error) {
                console.error(error);
            }
        };

        fetchPaymentTypes();
    }, [paymentTypeInput]);
    return (
        <Autocomplete
            className='payment-type-autocomplete'
            renderInput={(params) => <TextField {...params} label="Payment Type" name="payment-type-input"/>}
            inputValue={paymentTypeInput}
            filterOptions={(options) => {
                return options
            }}
            onChange={(e, value) => {

                setPaymentType(value);
            }}
            onInputChange={(e, value, reason) => {
                if (reason === "reset")
                    return;
                setPaymentTypeInput(value);
            }}
            options={
                paymentTypesList
            }
            getOptionLabel={(option) => {
                return option.name
            }}
            renderOption={(props, option) => {
                return (
                    <li {...props}>
                        {option.name}
                    </li>
                );
            }}
        />
    );
};
export default PaymentTypeAutocomplete;