import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { MemoryRouter } from 'react-router-dom';
import SOADashboard from '../pages/SOADashboard';

describe('SOADashboard Component', () => {
    it('renders correctly', () => {
      render(
        <MemoryRouter>
          <SOADashboard />
        </MemoryRouter>
      );
      
      // Test if specific elements are rendered
      expect(screen.getByText('Statement of Account ID')).toBeInTheDocument();
      expect(screen.getByText('Supplier Name')).toBeInTheDocument();
      expect(screen.getByText('Amount Outstanding')).toBeInTheDocument();

    });
  
  });