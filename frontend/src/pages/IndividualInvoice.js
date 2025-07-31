import { React, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams, useLocation } from 'react-router-dom';
import { ButtonGroup, Container, Typography, TextField, FormControlLabel, Checkbox, Grid, Button, IconButton, Autocomplete, createFilterOptions } from '@mui/material';
import { Warning } from '@mui/icons-material';
import { red } from '@mui/material/colors';
import { format } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import PaymentTypeAutocomplete from '../components/autocomplete/paymentType';
import FixedItemTable from '../components/invoiceformfields/FixedItemTable';
import Invoice from '../components/apiWrapper/Invoice';
import StorageLink from '../components/FileProcesses/StorageLink';

const IndividualInvoice = () => {
    const location = useLocation();
    const _id = location.state.invoice._id;
    const originalPaidValue = location.state.invoice.paid;
    const [invoice, setInvoice] = useState(location.state.invoice);
    const { invoiceId } = useParams();
    const [invoiceArray, setInvoiceArray] = useState(null);
    const [localPaid, setLocalPaid] = useState(false);
    const [localPaymentType, setLocalPaymentType] = useState(null);
    const [loading, setLoading] = useState(true);
    const [disablePaidCheckbox, setDisabledPaidCheckbox] = useState(location.state.invoice.paid);
    const [file, setFile] = useState(null);

    useEffect(() => {
        console.log('initial invoice', invoice);
        if (!invoice.paymentType)
            setInvoice({
                ...invoice, paymentType: {
                    name: ""
                }
            });
    }, [invoice]);
    // custom setPaymentType so that autocomplete can edit the invoice object's paymentType field 
    const setInvoicePaymentType = (newPaymentType) => {
        setInvoice((prevInvoice) => ({
            ...prevInvoice,
            paymentType: newPaymentType._id
        }));
    };
    const handlePaidCheckBox = (e) => {
        if (e.target.value === "on") {
            setInvoice({ ...invoice, paid: true });
        } else {
            setInvoice({ ...invoice, paid: false });
        }
    }
    const getInvoiceById = async () => {

        try {
            const curInvoice = await Invoice.getById(_id);
            console.log('curInvoice', curInvoice[0]);
            setLoading(false);
            setInvoice(curInvoice[0]);
        } catch (err) {
            console.error(err);
        }
    }
    useEffect(() => {
        getInvoiceById();
        const fetchFile = async () => {
            try {
                const file = await fetch(`http://localhost:8888/invoice/${_id}`);
                if (!file.ok) {
                    throw new Error('Failed to fetch file');
                }
                const invoiceData = await file.json();
                const fileLink = invoiceData.invoice.imageLink;
                setFile(fileLink);
            } catch (err) {
                console.error(err);
            }
        }
        fetchFile();
    }, [_id])

    const exportToCSV = async () => {
        try {
            console.log('invoice.invoiceID', invoice.invoiceID);
            await Invoice.getCsv(invoice.invoiceID);
            toast.success('Invoice exported successfully! Look at your Downloads.', {
                duration: 2000,
                className: "export-invoice-success-toast"
            })
        } catch (err) {
            console.error(err);
        }
    }

    const PaidCheckbox = () => {
        if (disablePaidCheckbox)
            return (
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={invoice.paid}
                            disabled
                        />
                    }
                    label="Paid"
                />
            );
        return (
            <FormControlLabel
                control={
                    <Checkbox
                        defaultChecked={invoice.paid}
                        onChange={handlePaidCheckBox}
                        id='paid-checkbox'
                    />
                }
                label="Paid"
            />
        )
    };


    const updateInvoice = async () => {
        try {
            const updatedPaymentType = invoice.paymentType;
            console.log(invoice.paymentType)
            if (invoice.paid === false) {
                toast.error('Please check the paid checkbox', {
                    duration: 2000,
                    className: "paid-invoice-failure-toast"
                });
                return;
            }
            const confirm = window.confirm(`Are you sure you want to update invoice ${invoice.invoiceID}?`);
            if (!confirm) {
                return;
            }
            console.log(invoice.productIDPriceQuantity);
            const updatedInvoice = {
                invoiceID: invoice.invoiceID,
                supplier: invoice.supplier._id,
                paymentType: updatedPaymentType,
                productIDPriceQuantity: invoice.productIDPriceQuantity.map(item => {
                    return {
                        price: item.price,
                        quantity: item.quantity,
                        productID: item._id,
                    };
                }),
                paid: invoice.paid,
                dateOfPurchase: invoice.dateOfPurchase,
                totalPriceBeforeGST: invoice.totalPriceBeforeGST,
                totalPriceAfterGST: invoice.totalPriceAfterGST
            }
            await Invoice.put(invoice._id, updatedInvoice);
            toast.success('Invoice updated successfully!', {
                duration: 5000,
                className: "paid-invoice-success-toast"
            });
            setTimeout(() => {
                window.location.href = '/dashboard/app';
            }, 2000);
        } catch (error) {
            toast.error('Invoice could not be updated!', {
                duration: 5000,
                className: "paid-invoice-success-toast"
            });
            console.error(error);
        }
    };

    return (
        <>
            {loading ? <div>Loading...</div>
                :
                <Container maxWidth="xl">
                    <Grid container >
                        <Grid item xs={9.7}>
                            <Typography variant="h4" id='invoice-title'>
                                Invoice ID: {invoice?.invoiceID}
                            </Typography>
                        </Grid>
                        <Grid item xs={2.3} >
                            <ButtonGroup variant="contained" aria-label="outlined primary button group">
                                <Button variant="contained"
                                    endIcon={<FileDownloadIcon />} onClick={exportToCSV} id='export-button'>
                                    Export to CSV
                                </Button>
                                <Button color="error" variant="contained" id='delete-button'
                                    endIcon={<DeleteIcon />} onClick={async () => {
                                        await Invoice.delete(invoice._id);
                                        // navigate back to dashboard
                                        toast.success('Invoice deleted successfully!', {
                                            duration: 5000,
                                            className: "delete-invoice-success-toast"
                                        });
                                        setTimeout(() => {
                                            window.location.href = '/dashboard/app';
                                        }, 2000);
                                    }}>
                                    Delete
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>

                    {!originalPaidValue && (
                        <Grid item xs={12}>
                            <Grid container alignItems="center" style={{ backgroundColor: red[100] }} p={2}>
                                <Grid container item xs={10} alignItems="center">
                                    <Grid item>
                                        <IconButton>
                                            <Warning />
                                        </IconButton>
                                    </Grid>
                                    <Grid item>
                                        <Typography variant="body1">
                                            This invoice has not been paid! Once paid, please update.
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid item xs={2} textAlign="right">
                                    <Button variant="contained" onClick={updateInvoice} style={{ backgroundColor: red[500] }} id='update-button'>
                                        Update
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}

                    <form>
                        <TextField
                            label="Invoice ID"
                            value={invoice.invoiceID}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            margin="normal"
                        />
                        <FixedItemTable items={invoice.productIDPriceQuantity} />
                        <TextField
                            label="Supplier"
                            value={invoice.supplier.name}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Date of Purchase"
                            value={format(new Date(invoice.dateOfPurchase), 'dd/MM/yyyy')}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            margin="normal"
                        />
                        <PaymentTypeAutocomplete paymentType={invoice.paymentType} setPaymentType={setInvoicePaymentType} />

                        <PaidCheckbox />
                        <TextField
                            label="Total Price Before GST"
                            value={invoice.totalPriceBeforeGST}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Total Price After GST"
                            value={invoice.totalPriceAfterGST}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="File link"
                            value={invoice.imageLink ? invoice.imageLink : "No file uploaded"}
                            InputProps={{ readOnly: true }}
                            fullWidth
                            margin="normal"
                            disabled
                        />
                        {invoice.imageLink && (
                            <StorageLink fileStored="true" fileLink={invoice.imageLink} />
                        )}
                    </form>
                </Container>
            }
        </>

    )
}

export default IndividualInvoice