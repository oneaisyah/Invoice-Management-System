import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
// import { Card, CardContent, IconButton } from '@mui/material';
import { Error } from '@mui/icons-material';
// import FileUploader from '../FileUploader';
import InvoiceUploaderPresenter from './InvoiceUploaderPresenter';
import Invoice from '../../apiWrapper/Invoice';

const InvoiceUploaderContainer = ({
    setInvoiceId,
    setSupplier,
    setPurchaseDate,
    setPaymentType,
    setIsPaid,
    setTotalPriceBeforeGst,
    setTotalPriceAfterGst,
    setItemsData,
    fileLink,
    setFileLink
}) => {
    const [file, setFile] = useState(null);
    const [fileProcessed, setFileProcessed] = useState(false);
    const [fileStored, setFileStored] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const extractData = (data) => {
        data = data.extractedData;
        if (data.invoiceID)
            setInvoiceId(data.invoiceID);
        if (data.supplier)
            setSupplier((prevSupplier) => ({ ...prevSupplier, name: data.supplier }));
        if (data.dateOfPurchase)
            setPurchaseDate(data.dateOfPurchase);
        if (data.paymentType)
            setPaymentType(data.paymentType);
        if (data.paid)
            setIsPaid(data.paid);
        if (data.totalPriceBeforeGST)
            setTotalPriceBeforeGst(data.totalPriceBeforeGST);
        if (data.totalPriceAfterGST)
            setTotalPriceAfterGst(data.totalPriceAfterGST);
        if (data.productIDPriceQuantity) {
            const newItemsData = [];
            data.productIDPriceQuantity.forEach((item) => {
                newItemsData.push({
                    productName: item?.productID,
                    productID: null,
                    price: item?.price,
                    quantity: item?.quantity
                });
            });
            setItemsData(newItemsData);
        }
    }
    const createFormData = () => {
        const formData = new FormData();
        formData.append('imageFile', file);
        return formData;
    }
    const handleUpload = (src) => {
        if (!src)
            return
        setFile(src.file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(src.file);
        setFileUploaded(true);
    }
    const handleOCR = async () => {
        if (!file)
            return;
        setLoading(true);
        try {
            const data = await Invoice.processImage(file);

            toast.success('Invoice processed successfully!', {
                duration: 2000,
                className: "add-invoice-success-toast"
            });
            extractData(data);
            setLoading(false);
            setFileProcessed(true);
        } catch (error) {
            console.error(error);
        }
    };
    const handleStorage = async () => {
        setLoading(true);
        try {
            const newLink = await Invoice.uploadImage(file)
            setFileLink(newLink);
            setFileStored(true);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }

    }
    return (
        <InvoiceUploaderPresenter
            loading={loading}
            fileUploaded={fileUploaded}
            fileProcessed={fileProcessed}
            fileStored={fileStored}
            fileLink={fileLink}
            file={file}
            imageUrl={imageUrl}
            handleUpload={handleUpload}
            handleOCR={handleOCR}
            handleStorage={handleStorage} />
    );
}
export default InvoiceUploaderContainer;