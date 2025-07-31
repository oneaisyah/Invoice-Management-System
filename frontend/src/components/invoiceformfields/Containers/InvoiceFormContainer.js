import { React, useEffect, useState } from 'react';
import InvoiceFormFieldsPresenter from '../Presenters/InvoiceFormPresenter';

const InvoiceFormContainer = ({
    invoiceId,
    setInvoiceId,
    supplier,
    setSupplier,
    purchaseDate,
    setPurchaseDate,
    paymentType,
    setPaymentType,
    isPaid,
    setIsPaid,
    totalPriceBeforeGst,
    setTotalPriceBeforeGst,
    totalPriceAfterGst,
    setTotalPriceAfterGst,
    fileLink,
    itemsData,
    setItemsData,
    itemTableFilled,
    setItemTableFilled,
    handleSubmit,
}) => {
    const [addingSupplier, setAddingSupplier] = useState(false);
    const [newSupplier, setNewSupplier] = useState(null);
    const [addingProduct, setAddingProduct] = useState(false);
    const [total, setTotal] = useState(0)

    const handleInvoiceId = (e) => {
        setInvoiceId(e.target.value);
    };
    const handlePurchaseDate = (e) => {
        setPurchaseDate(e.target.value);
    }
    const handleIsPaid = (e) => {
        setIsPaid(e.target.checked);
    }
    const handleTotalPriceBeforeGst = (e) => {
        setTotalPriceBeforeGst(e.target.value);
    }
    const handleTotalPriceAfterGst = (e) => {
        setTotalPriceAfterGst(e.target.value);
    }
    const handleAddingSupplier = () => {
        setAddingSupplier(!addingSupplier);
    };
    const handleAddingProduct = () => {
        setAddingProduct(!addingProduct);
    }
    useEffect(() => {
        if (newSupplier?._id)
            setSupplier(newSupplier);
    }, [newSupplier]);
    useEffect(() => {

        let newTotal = 0;
        itemsData.forEach((item) => {
            newTotal *= 100;
            newTotal += (item.price * 100 * item.quantity);
            newTotal = parseFloat(newTotal / 100).toFixed(2);
        });
        setTotal(newTotal);

    }, [itemsData])
    return (
        <InvoiceFormFieldsPresenter
            invoiceId={invoiceId}
            handleInvoiceId={handleInvoiceId}
            supplier={supplier}
            setSupplier={setSupplier}
            addingSupplier={addingSupplier}
            handleAddingSupplier={handleAddingSupplier}
            setNewSupplier={setNewSupplier}
            purchaseDate={purchaseDate}
            handlePurchaseDate={handlePurchaseDate}
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            isPaid={isPaid}
            handleIsPaid={handleIsPaid}
            totalPriceBeforeGst={totalPriceBeforeGst}
            handleTotalPriceBeforeGst={handleTotalPriceBeforeGst}
            totalPriceAfterGst={totalPriceAfterGst}
            handleTotalPriceAfterGst={handleTotalPriceAfterGst}
            addingProduct={addingProduct}
            handleAddingProduct={handleAddingProduct}
            total={total}
            fileLink={fileLink}
            itemsData={itemsData}
            setItemsData={setItemsData}
            itemTableFilled={itemTableFilled}
            setItemTableFilled={setItemTableFilled}
            handleSubmit={handleSubmit}
        />
    );
};


export default InvoiceFormContainer;