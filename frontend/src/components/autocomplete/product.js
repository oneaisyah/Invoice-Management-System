import { React, useState, useEffect, useRef } from 'react';
import { Autocomplete } from '@mui/material';
import Product from '../apiWrapper/Product';

const ProductAutocomplete = ({
    editItemData,
    product,
    setProduct
}) => {
    // Supplier
    const [productsList, setProductsList] = useState([]);
    const [productInput, setProductInput] = useState('');
    const inputRef = useRef()

    useEffect(() => {
        if (editItemData)
            setProductInput(editItemData.productName || '');
    }, [editItemData])
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                if (productInput === '' || !productInput) {
                    return;
                }
                const filter = { name: productInput }
                const products = await Product.getWithFilter(filter);
                console.log('products list in productautocomplete added to dropdown', products);
                setProductsList(products);
            } catch (error) {
                console.error(error);
            }
        };

        fetchProducts(); // Some will obviously fail since they may not have yet existed in the database
    }, [productInput]);
    return (
        <Autocomplete
            className='product-autocomplete'
            renderInput={(params) => (
                <div ref={params.InputProps.ref}>
                    <input
                        ref={inputRef}
                        type="text"
                        {...params.inputProps}
                        name='product-name-input'
                        value={productInput}
                        onChange={(e) => setProductInput(e.target.value)}
                    />
                </div>
            )}
            inputValue={productInput}
            filterOptions={(options) => {
                return options
            }}
            onChange={(e, value) => {
                if (value) {
                    setProductInput(value.name);
                    setProduct(value);
                }
            }}
            options={
                productsList
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
export default ProductAutocomplete;