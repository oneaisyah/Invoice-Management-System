import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import ProductFormFields from "../components/ProductFormFields/FormFields";

describe('ProductFormFields Component', () => {
  it('renders correctly and updates input values', () => {
    // Initial fake values
    const initialName = 'Initial Name';
    const initialUPC = '1234567890';

    // Create functions to set the state in your component
    const setName = jest.fn();
    
    const setUpc = jest.fn();

    // Render the component
    const { getByLabelText } = render(
      <ProductFormFields name={initialName} setName={setName} upc={initialUPC} setUpc={setUpc} />
    );

    // Get input elements by their labels
    const nameInput = getByLabelText('Name');
    const upcInput = getByLabelText('UPC');

    // Verify initial values
    expect(nameInput.value).toBe(initialName);
    expect(upcInput.value).toBe(initialUPC);

    // Simulate user input and check if state changes
    const newName = 'New Name';
    const newUPC = '9876543210';

    fireEvent.change(nameInput, { target: { value: newName } });
    fireEvent.change(upcInput, { target: { value: newUPC } });

    expect(setName).toHaveBeenCalledWith(newName);
    expect(setUpc).toHaveBeenCalledWith(newUPC);
  });

  it('handles empty input fields', () => {
    // Create functions to set the state in your component
    const setName = jest.fn();
    const setUpc = jest.fn();

    // Render the component with empty values
    const { getByLabelText } = render(
      <ProductFormFields name="" setName={setName} upc="" setUpc={setUpc} />
    );

    // Get input elements by their labels
    const nameInput = getByLabelText('Name');
    const upcInput = getByLabelText('UPC');

    // Verify empty input fields
    expect(nameInput.value).toBe('');
    expect(upcInput.value).toBe('');
  });
});
