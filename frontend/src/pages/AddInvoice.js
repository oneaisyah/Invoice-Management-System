import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';

// @mui
import { Grid, Container, Typography, Card, CardContent, IconButton } from '@mui/material';
import { Error } from '@mui/icons-material';
// components
// import FileUploader from '../components/ImageReader/FileUploader';
import InvoiceFormContainer from '../components/invoiceformfields/Containers/InvoiceFormContainer';
import InvoiceUploaderContainer from '../components/FileProcesses/Invoice/InvoiceUploaderContainer';
import Invoice from '../components/apiWrapper/Invoice';
// ----------------------------------------------------------------------

export default function AddInvoicePage() {
  const [invoiceId, setInvoiceId] = useState('');
  const [supplier, setSupplier] = useState({ name: '' });
  const [product, setProduct] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(null);
  const [paymentType, setPaymentType] = useState({ name: '' });
  const [isPaid, setIsPaid] = useState(false);
  const [totalPriceBeforeGst, setTotalPriceBeforeGst] = useState('');
  const [totalPriceAfterGst, setTotalPriceAfterGst] = useState('');
  const [fileLink, setFileLink] = useState('');
  const [itemsData, setItemsData] = useState([]);
  const [itemTableFilled, setItemTableFilled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = {
      invoiceID: invoiceId,
      supplier: supplier._id,
      dateOfPurchase: purchaseDate,
      paymentType: paymentType?._id,
      paid: isPaid,
      totalPriceBeforeGST: totalPriceBeforeGst,
      totalPriceAfterGST: totalPriceAfterGst,
      productIDPriceQuantity: itemsData.map(item => {
        const newItem = {
          productID: item.productID,
          price: item.price,
          quantity: item.quantity
        };
        return newItem;
      }),
      imageLink: fileLink
    };
    if (!paymentType)
      delete data.paymentType;
    console.log(data);

    let totalPriceQuantity = 0;
    for (let i = 0; i < itemsData.length; i += 1) {
      if (itemsData[i]) {
        totalPriceQuantity += itemsData[i].price * itemsData[i].quantity;
      }
    }

    try {
      await Invoice.post(data);

      toast.success('Invoice added successfully!', {
        duration: 2000,
        className: "add-invoice-success-toast"
      });
    } catch (error) {
      toast.error("Please fill in all fields correctly.", {
        duration: 7000,
        className: "add-invoice-failure-toast"
      });
      console.error(error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Add Invoice </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Add Invoice
        </Typography>

        <Grid container spacing={3}>

          <Grid item xs={6.7}>
            <Card>
              <CardContent>
                <InvoiceFormContainer
                  invoiceId={invoiceId}
                  setInvoiceId={setInvoiceId}
                  supplier={supplier}
                  setSupplier={setSupplier}
                  purchaseDate={purchaseDate}
                  setPurchaseDate={setPurchaseDate}
                  paymentType={paymentType}
                  setPaymentType={setPaymentType}
                  isPaid={isPaid}
                  setIsPaid={setIsPaid}
                  totalPriceBeforeGst={totalPriceBeforeGst}
                  setTotalPriceBeforeGst={setTotalPriceBeforeGst}
                  totalPriceAfterGst={totalPriceAfterGst}
                  setTotalPriceAfterGst={setTotalPriceAfterGst}
                  itemsData={itemsData}
                  setItemsData={setItemsData}
                  fileLink={fileLink}
                  handleSubmit={handleSubmit}
                  itemTableFilled={itemTableFilled}
                  setItemTableFilled={setItemTableFilled}
                  product={product}
                  setProduct={setProduct}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={5.3}>
            <Card>
              <CardContent>
                <InvoiceUploaderContainer
                  setInvoiceId={setInvoiceId}
                  setSupplier={setSupplier}
                  setPurchaseDate={setPurchaseDate}
                  setPaymentType={setPaymentType}
                  setIsPaid={setIsPaid}
                  setItemsData={setItemsData}
                  setTotalPriceBeforeGst={setTotalPriceBeforeGst}
                  setTotalPriceAfterGst={setTotalPriceAfterGst}
                  fileLink={fileLink}
                  setFileLink={setFileLink}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}