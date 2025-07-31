import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Card, CardContent, IconButton } from '@mui/material';
import SupplierForm from '../components/SupplierFormFields/SupplierForm';
import Supplier from '../components/apiWrapper/Supplier';
// ----------------------------------------------------------------------

export default function AddSupplier() {

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [uen, setUen] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            name,
            address,
            uen
        };
        try {
            await Supplier.post(data);
            toast.success('Supplier added successfully', {
                duration: 3000,
                className: 'supplier-add-success-toast',
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to add supplier.', {
                duration: 3000,
                className: 'supplier-add-failure-toast',
            });
            // Handle error or show error message to the user
        }
    };

    return (
        <>
            <Helmet>
                <title> Add Supplier </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Add Supplier
                </Typography>

                <Grid container spacing={3}>

                    <Grid item xs={24} sm={12} md={6}>
                        <Card>
                            <CardContent>
                                <SupplierForm
                                    name={name}
                                    setName={setName}
                                    address={address}
                                    setAddress={setAddress}
                                    uen={uen}
                                    setUen={setUen}
                                    handleSubmit={handleSubmit}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                </Grid>
            </Container>
        </>
    );
}