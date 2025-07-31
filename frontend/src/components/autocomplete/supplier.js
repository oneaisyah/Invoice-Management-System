import { React, useState, useEffect } from 'react';
import { TextField, Autocomplete } from '@mui/material';
import Supplier from '../apiWrapper/Supplier';

const SupplierAutocomplete = ({
    supplier,
    setSupplier
}) => {
    // Supplier
    const [suppliersList, setSuppliersList] = useState([]);
    const [supplierInput, setSupplierInput] = useState('');

    useEffect(() => {
        const checkAndSetSupplier = async () => {
            try {
                if (supplier?.name) {
                    const filter = { name: supplier.name };
                    const suppliers = await Supplier.getWithFilter(filter);
                    setSuppliersList(suppliers);

                    // Check if the supplier is in the list and set it
                    const matchedSupplier = suppliers.find(s => s.name === supplier.name);
                    if (matchedSupplier) {
                        setSupplier(matchedSupplier);
                        setSupplierInput(matchedSupplier.name);
                    } else {
                        setSupplierInput('');
                        setSupplier(null); // Clear supplier if not found
                    }
                } else {
                    setSupplierInput('');
                    setSupplier(null); // Clear supplier if no name
                }
            } catch (error) {
                console.error(error);
            }
        };

        checkAndSetSupplier();
        console.log("supplier", supplier);
    }, [supplier?.name]);

    useEffect(() => {
        const fetchSuppliers = async () => {
            try {
                if (supplierInput === '')
                    return;
                const filter = { name: supplierInput };
                const suppliers = await Supplier.getWithFilter(filter);
                setSuppliersList(suppliers);
            } catch (error) {
                console.error(error);
            }
        };

        fetchSuppliers();
    }, [supplierInput]);

    return (
        <Autocomplete
            className='supplier-autocomplete'
            renderInput={(params) => <TextField {...params} label="Supplier" name='supplier-input' />}
            inputValue={supplierInput}
            filterOptions={(options) => {
                return options
            }}
            onChange={(e, value) => {
                console.log("onChange", value);
                setSupplier(value);
            }}
            onInputChange={(e, value, reason) => {
                console.log("onInputChange", value, reason);
                if (reason !== "reset") {
                    setSupplierInput(value);
                }
            }}
            options={
                suppliersList
            }
            getOptionLabel={(option) => {
                return option.name
            }}
            renderOption={(props, option) => {
                return (
                    <li {...props}>
                        {option.name}
                    </li>
                );
            }}
        />
    );
};
export default SupplierAutocomplete;