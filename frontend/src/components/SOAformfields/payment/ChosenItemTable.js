import React, { useEffect } from 'react'
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Delete } from '@mui/icons-material';

const ChosenItemTable = ({
    payments, setPayments
}) => {

    const handleDeleteItem = (e, index) => {
        e.preventDefault();
        const newPayments = [...payments];
        newPayments.splice(index, 1);
        setPayments(newPayments);
        alert(`Deleted item ${index} successfully!`);
    };
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Recipient Name</TableCell>
                        <TableCell>Reference Number</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>Payment Type</TableCell>
                        <TableCell>Date Of Payment</TableCell>
                        <TableCell>Action</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {payments ? payments.map((payment, index) => (
                        <TableRow key={index} hover >
                            <TableCell>
                                {index + 1}
                            </TableCell>
                            <TableCell>
                                {payment.recipientName}
                            </TableCell>
                            <TableCell>
                                {payment.referenceNumber}
                            </TableCell>
                            <TableCell>
                                {payment.amount}
                            </TableCell>
                            <TableCell>
                                {payment.type.name}
                            </TableCell>
                            <TableCell>
                                {payment.dateOfPayment}
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