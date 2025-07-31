import { useState } from 'react';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
// @mui
import { Grid, Container, Typography, Card, CardContent } from '@mui/material';
// ----------------------------------------------------------------------
import ProductForm from '../components/ProductFormFields/ProductForm'
import Product from '../components/apiWrapper/Product';

export default function AddProduct() {
    const [name, setName] = useState('');
    const [upc, setUpc] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        const data = {
            name,
            upc
        };
        if (!upc)
            delete data.upc;
        try {
            await Product.post(data);
            toast.success('Product added successfully', {
                duration: 3000,
                className: 'product-add-success-toast',
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to add product.', {
                duration: 3000,
                className: 'product-add-failure-toast',
            });
            // Handle error or show error message to the user
        }
    };

    return (
        <>
            <Helmet>
                <title> Add Product </title>
            </Helmet>

            <Container maxWidth="xl">
                <Typography variant="h4" sx={{ mb: 5 }}>
                    Add Product
                </Typography>

                <Grid container spacing={3}>

                    <Grid item xs={24} sm={12} md={6}>
                        <Card>
                            <CardContent>
                                <ProductForm
                                    name={name}
                                    setName={setName}
                                    upc={upc}
                                    setUpc={setUpc}
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