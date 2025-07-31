import { useState, useEffect } from 'react';
// import { Card, CardContent, IconButton } from '@mui/material';
import { Error } from '@mui/icons-material';
// import FileUploader from '../FileUploader';
import SOAUploaderPresenter from './SOAUploaderPresenter';
import Invoice from '../../apiWrapper/Invoice';

const SOAUploaderContainer = ({
    fileLink,
    setFileLink
}) => {
    const [file, setFile] = useState(null);
    const [fileStored, setFileStored] = useState(false);
    const [fileUploaded, setFileUploaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rotationDegree, setRotationDegree] = useState(0);
    const [imageUrl, setImageUrl] = useState('')


    const handleStorage = async () => {
        setLoading(true);
        console.log('fileStorage in handleStorage', fileStored);
        try {
            const mediaLink = await Invoice.uploadImage(file)
            setFileLink(mediaLink);
            setFileStored(true);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
        console.log('fileStorage in handleStorage end', fileStored);

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
    return (
        <SOAUploaderPresenter
            loading={loading}
            fileUploaded={fileUploaded}
            fileStored={fileStored}
            fileLink={fileLink}
            file={file}
            imageUrl={imageUrl}
            handleUpload={handleUpload}
            handleStorage={handleStorage} />
    );
}
export default SOAUploaderContainer;