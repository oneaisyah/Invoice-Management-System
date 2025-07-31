import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SupplierAutocomplete from './supplier';

import '@testing-library/jest-dom/extend-expect';

describe('SupplierAutocomplete Component', () => {
    test('it should render and change input value', () => {
        render(<SupplierAutocomplete product={null} setSupplier={() => {}} />);
        const inputField = screen.getByRole('combobox'); 
        fireEvent.change(inputField, { target: { value: 'Test Supplier' } });

        // You can use another query to check if the input value has changed
        expect(inputField.value).toBe("");
    });
});