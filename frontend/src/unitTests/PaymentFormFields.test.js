// PaymentFormFields.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentFormFields from '../components/PaymentFormFields/PaymentFormFields'; // Adjust the path based on your project structure

describe('PaymentFormFields', () => {
  it('handles input changes correctly', () => {
    // Mock the set functions
    const setAmount = jest.fn();
    const setType = jest.fn();
    const setDateOfPayment = jest.fn();
    const setReferenceNumber = jest.fn();
    const setRecipientName = jest.fn();

    // Render the component
    render(
      <PaymentFormFields
        amount=""
        setAmount={setAmount}
        type=""
        setType={setType}
        dateOfPayment=""
        setDateOfPayment={setDateOfPayment}
        referenceNumber=""
        setReferenceNumber={setReferenceNumber}
        recipientName=""
        setRecipientName={setRecipientName}
      />
    );

    // Simulate input changes
    fireEvent.change(screen.getByLabelText('Recipient Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Reference Number'), { target: { value: '12345' } });
    fireEvent.change(screen.getByLabelText('dateOfPayment'), { target: { value: '2023-08-07' } });

    // Check if the set functions were called with the correct values
    expect(setRecipientName).toHaveBeenCalledWith('John Doe');
    expect(setReferenceNumber).toHaveBeenCalledWith('12345');
    expect(setDateOfPayment).toHaveBeenCalledWith('2023-08-07');

    // Similar checks for other fields
  });
});
