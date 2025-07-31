import toast from "react-hot-toast";
import Resource from "./Resource"

class StatementOfAccountResource extends Resource {
    constructor() {
        super('statement-of-account', 'statementOfAccount');
    }

    async getCsv(referenceNumber) {

        const response = await fetch(`${this.baseURLToSendHTTPRequest}/statement-of-account/csv?referenceNumber=${referenceNumber}`, {
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

    async uploadImage(image) {
        const formData = createFormData(image);
        const response = await fetch(`${this.baseURLToSendHTTPRequest}/${this.route}/upload-image`, {
            method: 'POST',
            headers: {
                'Authorization': JSON.parse(localStorage.getItem('user')).token
            },
            body: formData,
        });
        const data = await response.json();
        if (!response.ok) {
            console.log('Error', data.error);
            throw new Error(data.error);
        }
        return data.mediaLink;
    }

}
function createFormData(image) {
    const formData = new FormData();
    formData.append('imageFile', image);
    return formData;
}
const StatementOfAccount = new StatementOfAccountResource();
export default StatementOfAccount;