import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, Card, CardContent, Typography } from '@mui/material';
import ProductFormFields from '../ProductFormFields/FormFields';
import Product from "../apiWrapper/Product";

const ProductPopup = ({
    setShow,
    setProduct
}) => {
    const [name, setName] = useState('');
    const [upc, setUpc] = useState('');
    const handleAdd = async (event) => {
        event.preventDefault();
        const data = {
            name,
            upc
        };
        try {
            if (!data.upc)
                delete data.upc;
            const postedProduct = await Product.post(data);
            if (setProduct)
                setProduct(postedProduct);
            setShow(false);
            toast.success('Product added successfully!', {
                duration: 5000,
                className: 'add-product-success-toast'
            });
        } catch (err) {
            console.error(err);
            toast.error('Please fill in all fields correctly.',{
                duration: 5000,
                className: 'add-product-failure-toast'
            });
        }
    };
    const handleCancel = () => {
        setShow(false)
    }
    return (
        <Card variant="outlined" style={{ margin: '10px' }}>
            <CardContent>
                <Typography variant="h6">New Product</Typography>
            </CardContent>
            <CardContent>
                <ProductFormFields
                    name={name}
                    setName={setName}
                    upc={upc}
                    setUpc={setUpc}
                />
            </CardContent>
            <Button onClick={handleAdd} id='create-product-button'>Create</Button>
            <Button onClick={handleCancel}>Cancel</Button>
        </Card>
    )
};
export default ProductPopup;