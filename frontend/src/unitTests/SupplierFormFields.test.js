import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SupplierFormFields from '../components/SupplierFormFields/FormFields.js';

describe('SupplierFormFields Component', () => {
  it('renders correctly and updates input values', () => {
    // Initial fake values
    const initialName = 'Initial Supplier';
    const initialAddress = '123 Main St';
    const initialUEN = '123456789A';

    // Create functions to set the state in your component
    const setName = jest.fn();
    const setAddress = jest.fn();
    const setUen = jest.fn();

    // Render the component
    const { getByLabelText } = render(
      <SupplierFormFields
        name={initialName}
        setName={setName}
        address={initialAddress}
        setAddress={setAddress}
        uen={initialUEN}
        setUen={setUen}
      />
    );

    // Get input elements by their labels
    const nameInput = getByLabelText('Name');
    const addressInput = getByLabelText('Address');
    const uenInput = getByLabelText('UEN');

    // Verify initial values
    expect(nameInput.value).toBe(initialName);
    expect(addressInput.value).toBe(initialAddress);
    expect(uenInput.value).toBe(initialUEN);

    // Simulate user input and check if state changes
    const newName = 'New Supplier';
    const newAddress = '456 Elm St';
    const newUEN = '987654321B';

    fireEvent.change(nameInput, { target: { value: newName } });
    fireEvent.change(addressInput, { target: { value: newAddress } });
    fireEvent.change(uenInput, { target: { value: newUEN } });

    expect(setName).toHaveBeenCalledWith(newName);
    expect(setAddress).toHaveBeenCalledWith(newAddress);
    expect(setUen).toHaveBeenCalledWith(newUEN);
  });
    it('handles empty input fields', () => {
    // Create functions to set the state in your component
    const setName = jest.fn();
    const setAddress = jest.fn();
    const setUen = jest.fn();

    // Render the component with empty values
    const { getByLabelText } = render(
      <SupplierFormFields
        name=""
        setName={setName}
        address=""
        setAddress={setAddress}
        uen=""
        setUen={setUen}
      />
    );

    // Get input elements by their labels
    const nameInput = getByLabelText('Name');
    const addressInput = getByLabelText('Address');
    const uenInput = getByLabelText('UEN');

    // Verify empty input fields
    expect(nameInput.value).toBe('');
    expect(addressInput.value).toBe('');
    expect(uenInput.value).toBe('');
  });
});
