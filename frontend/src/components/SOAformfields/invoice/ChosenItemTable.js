import React, { useEffect } from 'react'
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Delete } from '@mui/icons-material';

const ChosenItemTable = ({
    invoices, setInvoices
}) => {
    const handleDeleteItem = (e, index) => {
        e.preventDefault();
        const newInvoices = [...invoices];
        newInvoices.splice(index, 1);
        setInvoices(newInvoices);
        alert(`Deleted item ${index} successfully!`);
    };
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Invoice ID</TableCell>
                        <TableCell>Supplier</TableCell>
                        <TableCell>Payment Type</TableCell>
                        <TableCell>Total Price Before GST</TableCell>
                        <TableCell>Total Price After GST</TableCell>
                        <TableCell>Date Of Purchase</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {invoices ? invoices.map((invoice, index) => (
                        <TableRow key={index} hover >
                            <TableCell>
                                {invoice.invoiceID}
                            </TableCell>
                            <TableCell>
                                {invoice.supplier.name}
                            </TableCell>
                            <TableCell>
                                {invoice.paymentType ? invoice.paymentType.name : "NA"}
                            </TableCell>
                            <TableCell>
                                {invoice.totalPriceBeforeGST}
                            </TableCell>
                            <TableCell>
                                {invoice.totalPriceAfterGST}
                            </TableCell>
                            <TableCell>
                                {`${new Date(invoice.dateOfPurchase).toLocaleDateString('en-SG')}`}
                            </TableCell>
                            <TableCell>
                                <IconButton onClick={(e) => handleDeleteItem(e, index)}>
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    )) : []}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default ChosenItemTable;