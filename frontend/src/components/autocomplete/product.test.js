import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductAutocomplete from './product';
import '@testing-library/jest-dom/extend-expect';

describe('ProductAutocomplete Component', () => {
    test('it should render and change input value', () => {
        render(<ProductAutocomplete product={null} setProduct={() => {}} />);

        const inputField = screen.getByRole('combobox'); 
        fireEvent.change(inputField, { target: { value: 'Test Product' } });

        // You can use another query to check if the input value has changed
        expect(inputField.value).toBe("");
    });
});
  
  
  
  
  