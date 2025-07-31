import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Button, Card, TextField, CardContent, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import InvoiceDashboard from './InvoiceDashboard';
import SOADashboard from './SOADashboard';

export default function DashboardAppPage() {
  
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Invoice Management System</title>
      </Helmet>
      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Invoice Management System
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={12} lg={12}>
            <InvoiceDashboard />
          </Grid>

          <Grid item xs={12} md={12} lg={12}>
            <SOADashboard />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
