import { useEffect } from 'react';
import { Button, Grid, CircularProgress, Link } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import FilePreview from '../FilePreview';
import FileUploader from '../FileUploader';
import FileProcessButton from '../FileProcessButton';
import FileStoreButton from '../FileStoreButton';
import StorageLink from '../StorageLink';
import FileLoadingIcon from '../FileLoadingIcon';


const SOAUploaderUnit = ({
    loading,
    fileUploaded,
    fileStored,
    fileLink,
    imageUrl,
    handleUpload,
    handleStorage
}) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={12} flex>
                <FilePreview
                    fileUploaded={fileUploaded}
                    imageUrl={imageUrl}
                />
            </Grid>
            <Grid item xs={12}>
                <FileUploader handleUpload={handleUpload} />
            </Grid>
            <Grid item xs={12}>
                <FileStoreButton
                    fileStored={fileStored}
                    handleStorage={handleStorage} />
            </Grid>
            <Grid item xs={12}>
                <StorageLink fileStored={fileStored} fileLink={fileLink} />
            </Grid>
            <Grid item xs={12}>
                {loading ? <FileLoadingIcon /> : ''}
            </Grid>
        </Grid>
    )
}

export default SOAUploaderUnit;
