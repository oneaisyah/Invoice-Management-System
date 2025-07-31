import { React, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { TableRow, TableCell, Table, Paper, TableHead, TableContainer, TableBody, IconButton, Typography } from '@mui/material';
import { AddCircle } from '@mui/icons-material';
import ProductAutocomplete from '../autocomplete/product';
import EditItemRow from './EditItemRow';
import ReadItemRow from './ReadItemRow';
// Items Table
const ItemTable = ({
    itemsData,
    setItemsData,
    itemTableFilled,
    setItemTableFilled
}) => {
    const [product, setProduct] = useState('');
    const [rowIndex, setRowIndex] = useState(null);
    const [addItemData, setAddItemData] = useState({
        productID: '',
        price: '',
        quantity: ''
    });
    const [editItemData, setEditItemData] = useState({
        productName: '',
        productID: '',
        price: '',
        quantity: ''
    });

    // update itemTableFilled state to true if all items have productName, productID, price and quantity
    useEffect(() => {
        if (Object.keys(itemsData).length > 0) {
            let filled = true;
            Object.keys(itemsData).forEach((key) => {
                if (itemsData[key]) {
                    if (!itemsData[key].productName || !itemsData[key].productID || !itemsData[key].price || !itemsData[key].quantity) {
                        filled = false;
                    }
                }
            });
            setItemTableFilled(filled);
        }
    }, [itemsData]);
    const handleEditItemChange = (e) => {
        const fieldName = e.target.getAttribute('name');
        const fieldValue = e.target.value;

        const newEditItemData = { ...editItemData };
        newEditItemData[fieldName] = fieldValue;

        setEditItemData(newEditItemData);
    };

    const handleEditItem = (e) => {
        const editedItem = {
            productName: editItemData.productName,

            productID: editItemData.productID,
            price: editItemData.price,
            quantity: editItemData.quantity
        };

        const newItemsData = [...itemsData];
        newItemsData[rowIndex] = editedItem;
        setItemsData(newItemsData);
        setRowIndex(null);
    };

    const handleEditClick = (e, index) => {
        setRowIndex(index);
        console.log("This is the edit click: itemsData", itemsData)
        console.log("Index", index)
        const editedItem = {
            productName: itemsData[index].productName,
            productID: itemsData[index].productID,
            price: itemsData[index].price,
            quantity: itemsData[index].quantity
        }

        console.log("🚀 ~ handleEditClick ~ editedItem:", editedItem);
        setEditItemData(editedItem);
    }



    const handleAddItemChange = (e) => {
        e.preventDefault();
        const fieldName = e.target.getAttribute('name');
        const fieldValue = e.target.value;

        const newAddItemData = { ...addItemData };
        newAddItemData[fieldName] = fieldValue;

        setAddItemData(newAddItemData);
    };

    const handleAddItem = (e) => {
        e.preventDefault();
        const newItem = {
            productName: product.name,
            productID: product._id,
            price: addItemData.price,
            quantity: addItemData.quantity
        };

        const newItemsData = [...itemsData, newItem];
        setItemsData(newItemsData);
        setProduct({
            productName: "",
            productID: "",
            price: "",
            quantity: ""
        })
        toast.success(`Added item ${product.name} successfully!`, {
            duration: 2000,
            className: "add-item-success-toast"
        });
    };
    const handleCancelEdit = (e) => {
        e.preventDefault();
        setRowIndex(null);
    };

    const handleDeleteItem = (e, index) => {
        e.preventDefault();
        console.log(index);
        const newItemsData = [...itemsData];
        newItemsData.splice(index, 1);
        setItemsData(newItemsData);
        toast.success(`Deleted item successfully!`, {
            duration: 2000,
            className: "delete-item-success-toast"
        });
        console.log(itemsData);
    };

    return (
        <TableContainer component={Paper}>
            <Table className='invoice-item-table'>
                <TableHead>
                    <TableRow>
                        <TableCell  >Input Product </TableCell>
                        <TableCell  >Chosen Product </TableCell>
                        <TableCell >Price</TableCell>
                        <TableCell >Quantity</TableCell>
                        <TableCell >Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {Object.keys(itemsData).map((key) => (
                        <>
                            {
                                itemsData[key]
                                    ? rowIndex === key
                                        ? (<EditItemRow
                                            product={product}

                                            setProduct={setProduct}
                                            editItemData={editItemData}
                                            setEditItemData={setEditItemData}
                                            handleEditItemChange={handleEditItemChange}
                                            handleEditItem={handleEditItem}
                                            handleCancelEdit={handleCancelEdit}
                                        />)
                                        : (<ReadItemRow
                                            item={itemsData[key]}
                                            index={key}
                                            handleEditClick={handleEditClick}
                                            handleDeleteItem={handleDeleteItem}
                                            setRowIndex={setRowIndex}
                                            setEditItemData={setEditItemData}
                                        />)
                                    : null
                            }
                        </>
                    ))}
                    <TableRow>
                        <TableCell >
                            <ProductAutocomplete product={product} setProduct={setProduct} />
                        </TableCell>
                        <TableCell>
                            <Typography variant="h8" >
                                Choose a product
                            </Typography>
                        </TableCell>
                        <TableCell>
                            <input
                                type='number'
                                name='price'
                                placeholder='Price'
                                onChange={handleAddItemChange}
                            />
                        </TableCell>
                        <TableCell>
                            <input
                                type='number'
                                name='quantity'
                                placeholder='Quantity'
                                onChange={handleAddItemChange}
                            />
                        </TableCell>
                        <TableCell>
                            <IconButton onClick={handleAddItem} id='add-product-button'>
                                <AddCircle />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
export default ItemTable;