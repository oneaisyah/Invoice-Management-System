import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// @mui
import { Avatar, Grid, Container, Typography, Button, Card, TextField, CardContent, MenuItem } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';


export default function ProfilePage() {

const handleEdit = () => {
    // Your edit functionality here
    console.log('Edit button clicked!');
    // Implement the logic for handling the edit functionality, e.g., opening a dialog or form for editing the user's basic info.
    };
  
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI Page 2 </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Profile Page
        </Typography>

        
        <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} md={12} lg={12} >
          <Card>
            <CardContent style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Profile pic */}
              {/* Profile pic */}
              <Avatar src="/assets/images/avatars/avatar_default.jpg" alt="hello" sx={{ width: 200, height: 200, marginBottom: 5 }} />

              {/* First line of text */}
              <Typography variant="h3" sx={{ marginBottom: 2 }}>
                Enric Sng
              </Typography>

              {/* Second line of text */}
              <Typography variant="h6">
                Big Boss
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={12} lg={12}>
            <Card>
                <CardContent style={{ height: '275px', alignItems: 'center' }}>
                <Grid container spacing={2} alignItems="center" justifyContent="center">
                    <CardContent style={{ height: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Main text with Edit button */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Typography variant="h5" sx={{ marginBottom: 2, textAlign: 'center' }}>
                        Basic Info
                        </Typography>

                        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <Button variant="outlined" color="primary" onClick={handleEdit}>
                            Edit
                        </Button>
                        </div>
                    </div>

                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Fullname: Enric Sng
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Email Address: enric@example.com
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Password: **********
                    </Typography>
                    <Typography variant="body1" sx={{ marginBottom: 1 }}>
                        Privilege: Administrator
                    </Typography>
                    </CardContent>
                </Grid>
                </CardContent>
            </Card>
            </Grid>

        </Grid>
      </Container>
    </>
  );
}
