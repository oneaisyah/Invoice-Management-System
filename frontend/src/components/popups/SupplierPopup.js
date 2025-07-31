import { useState } from 'react';
import toast from 'react-hot-toast';
import { Button, Card, CardContent, Typography } from '@mui/material';
import Supplier from "../apiWrapper/Supplier";
import SupplierFormFields from '../SupplierFormFields/FormFields';

const SupplierPopup = ({
    setShow,
    setSupplier
}) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [uen, setUen] = useState('');
    const handleAdd = async (event) => {
        event.preventDefault();
        const data = {
            name,
            address,
            uen
        };
        try {
            const postedSupplier = await Supplier.post(data);
            setSupplier(postedSupplier);
            setShow(false);
            toast.success('Supplier added successfully!', {
                duration: 5000,
                className: 'add-supplier-success-toast'
            });
        } catch (err) {
            console.error(err);
            toast.error('Please fill in all fields correctly.',{
                duration: 5000,
                className: 'add-supplier-failure-toast'
            });
        }
    };
    const handleCancel = () => {
        setShow(false)
    }
    return (
        <Card variant="outlined">
            <CardContent>
                <Typography variant="h6">New Supplier</Typography>
            </CardContent>
            <CardContent>
                <SupplierFormFields
                    name={name}
                    setName={setName}
                    address={address}
                    setAddress={setAddress}
                    uen={uen}
                    setUen={setUen}
                />
            </CardContent>
            <Button onClick={handleAdd} id='create-supplier-button'>Create</Button>
            <Button onClick={handleCancel}>Cancel</Button>
        </Card>
    )
};
export default SupplierPopup