import React, { useState } from 'react';
import TextField from '@mui/material/TextField';

const DollarInputField = (amount, setAmount, label) => {

    const handleDollarChange = (event) => {
        // Remove non-numeric and extra decimal characters
        let sanitizedValue = event.target.value.replace(/[^0-9.]/g, '');
        const decimalCount = sanitizedValue.split('.').length - 1;

        if (decimalCount > 1) {
            // More than one decimal point, keep only the first one
            sanitizedValue = sanitizedValue.replace(/\.+/, '.');
        }

        // Ensure exactly two digits after decimal point
        const parts = sanitizedValue.split('.');
        if (parts[1] && parts[1].length > 2) {
            parts[1] = parts[1].slice(0, 2);
        }
        sanitizedValue = parts.join('.');

        setAmount(sanitizedValue);
    };

    return (
        <TextField
            label={label}
            value={amount}
            onChange={handleDollarChange}
            placeholder="Enter dollar amount"
        // You can add other TextField props here as needed
        />
    );
};

export default DollarInputField;