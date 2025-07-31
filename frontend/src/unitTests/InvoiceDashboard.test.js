import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import InvoiceDashboard from '../pages/InvoiceDashboard';

describe('InvoiceDashboard Component', () => {
  it('renders correctly', () => {
    render(
      <MemoryRouter>
        <InvoiceDashboard />
      </MemoryRouter>
    );

    // Test if specific elements are rendered
    expect(screen.getByText('Invoice ID')).toBeInTheDocument();
    expect(screen.getByText('Supplier Name')).toBeInTheDocument();
    // Add more assertions as needed
  });
});
