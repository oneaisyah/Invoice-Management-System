import React from 'react'
import { TableRow, TableCell, Typography, IconButton, Grid } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import WarningIcon from '@mui/icons-material/Warning';

const ReadItemRow = ({ item, index, handleEditClick, handleDeleteItem }) => {
    return (
        <TableRow>
            <TableCell>
                {item.productName ? item.productName : <WarningIcon />}
            </TableCell>
            <TableCell>
                <Typography variant="h8" >
                    {item.productID ? item.productName : "Choose a product"}
                </Typography>
            </TableCell>
            <TableCell>
                {item.price ? item.price : <WarningIcon />}
            </TableCell>
            <TableCell>
                {item.quantity ? item.quantity : <WarningIcon />}
            </TableCell>
            <TableCell>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <IconButton onClick={(e) => handleEditClick(e, index)}>
                            <Edit />
                        </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                        <IconButton onClick={(e) => handleDeleteItem(e, index)} id='delete-item-button'>
                            <Delete />
                        </IconButton>
                    </Grid>
                </Grid>
            </TableCell>
        </TableRow>
    )
}

export default ReadItemRow