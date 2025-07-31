import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PaymentTypeAutocomplete from './paymentType';

import '@testing-library/jest-dom/extend-expect';

describe('PaymentTypeAutocomplete Component', () => {
    test('it should render and change input value', () => {
        render(<PaymentTypeAutocomplete paymentType={null} setPaymentType={() => {}} />);

        const inputField = screen.getByRole('combobox'); // Use 'textbox' role
        fireEvent.change(inputField, { target: { value: 'Test Payment Type' } });

        expect(inputField.value).toBe("Test Payment Type");
    });

    
});
  
  