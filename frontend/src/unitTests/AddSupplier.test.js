import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddSupplier from '../pages/AddSupplier';
import '@testing-library/jest-dom/extend-expect';
import Supplier from '../components/apiWrapper/Supplier';
jest.mock('react-helmet-async', () => ({
    Helmet: ({ children }) => <>{children}</>,
}));
describe('Fields rendered', () => {
    test('it should render text boxes', () => {
        render(<AddSupplier />);
        const nameField = screen.getByLabelText('Name');
        expect(nameField).toBeInTheDocument();
        const addressField = screen.getByLabelText('Address');
        expect(addressField).toBeInTheDocument();
        const uenField = screen.getByLabelText('UEN');
        expect(uenField).toBeInTheDocument();
    });
})
describe('handleSubmit', () => {
    test('it should call Supplier.post when user fill text boxes', async () => {
        render(<AddSupplier />);

        Supplier.post = jest.fn(); // Mock the Supplier.post method
        const nameField = screen.getByLabelText('Name');
        const addressField = screen.getByLabelText('Address');
        const uenField = screen.getByLabelText('UEN');
        const submitButton = screen.getByText('Submit');
        const dataToPost = {
            name: 'SINGAPORE COMPANY PTE. LTD.',
            address: 'first street, Singapore,100100',
            uen: '123456789X'
        };
        fireEvent.change(nameField, { target: { value: dataToPost.name } });
        fireEvent.change(addressField, { target: { value: dataToPost.address } });
        fireEvent.change(uenField, { target: { value: dataToPost.uen } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            expect(Supplier.post).toHaveBeenCalledWith(
                dataToPost
            );
        })
    });
})