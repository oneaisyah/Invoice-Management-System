import React, { useEffect } from 'react'
import { TableRow, TableCell, Typography, IconButton, Grid } from '@mui/material';
import { Cancel, Save } from '@mui/icons-material';
import ProductAutocomplete from '../autocomplete/product';

const EditItemRow = ({ product, setProduct, editItemData, setEditItemData, handleEditItemChange, handleEditItem, handleCancelEdit }) => {
    console.log("editItemData",editItemData);
    useEffect(() => {
        console.log("editItemData", editItemData);
        setEditItemData({
            ...editItemData,
            productID: product._id,
        });
    }, [])
    return (
        <TableRow>
            <TableCell>
                <ProductAutocomplete product={product} setProduct={setProduct} editItemData={editItemData} />
            </TableCell>
            <TableCell>

                <Typography variant="h8" >
                    {editItemData.productID ? editItemData.productName : "Choose a product"}
                </Typography>
            </TableCell>
            <TableCell>
                <input
                    type='number'
                    name='price'
                    value={editItemData.price}
                    onChange={handleEditItemChange}
                />
            </TableCell>
            <TableCell>
                <input
                    type='number'
                    name='quantity'
                    value={editItemData.quantity}
                    onChange={handleEditItemChange}
                />
            </TableCell>
            <TableCell>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <IconButton onClick={handleCancelEdit}>
                            <Cancel />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton onClick={handleEditItem}>
                            <Save />
                        </IconButton>
                    </Grid>
                </Grid>
            </TableCell>
        </TableRow>
    )
}

export default EditItemRow