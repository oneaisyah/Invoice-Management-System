import toast from "react-hot-toast";
import Resource from "./Resource"

class InvoiceResource extends Resource {
    constructor() {
        super('invoice', 'invoice');
    }

    async processImage(image) {
        const formData = createFormData(image);
        const response = await fetch(`${this.baseURLToSendHTTPRequest}/invoice/process-image`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
        })
        const data = await response.json();
        if (!response.ok) {
            console.log('Error:', data.error);
            toast.error(data.error.message, {
                duration: 3000,
                className: 'process-image-failure-toast',
            });
            throw new Error('Failed to upload the file.');
        }
        return data;
    }

    async uploadImage(image) {
        const formData = createFormData(image);
        const response = await fetch(`${this.baseURLToSendHTTPRequest}/invoice/upload-image`, {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
        });
        console.log('in upload image', JSON.parse(localStorage.getItem('user')).token)
        const data = await response.json();
        if (!response.ok) {
            console.log('Error', data.error);
            throw new Error(data.error);
        }
        return data.mediaLink;
    }

    async getCsv(invoiceID) {

        const response = await fetch(`${this.baseURLToSendHTTPRequest}/invoice/csv?invoiceID=${invoiceID}`, {
            method: 'GET',
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
        });
        // const data = await response.json();
        if (!response.ok) {
            // console.log('Error', data.error);
            throw new Error('Error in fetching csv');
        }
        const csvBlob = await response.blob();
        const csvUrl = window.URL.createObjectURL(csvBlob);
        window.open(csvUrl, "_blank").focus();
    }
}

function createFormData(image) {
    const formData = new FormData();
    formData.append('imageFile', image);
    return formData;
}
const Invoice = new InvoiceResource();
export default Invoice;