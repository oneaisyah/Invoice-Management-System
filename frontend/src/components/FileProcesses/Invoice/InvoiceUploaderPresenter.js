import { Card, CardContent, IconButton } from '@mui/material'
import { RotateLeft, RotateRight } from '@mui/icons-material';
import InvoiceUploaderUnit from './InvoiceUploaderUnit';

const InvoiceUploaderPresenter = ({
    loading,
    fileUploaded,
    fileProcessed,
    fileStored,
    fileLink,
    imageUrl,
    handleUpload,
    handleOCR,
    handleStorage
}) => {
    return (
        <Card>
            <CardContent>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton >
                        <RotateLeft />
                    </IconButton>
                    <IconButton >
                        <RotateRight />
                    </IconButton>
                </div>
                <InvoiceUploaderUnit
                    loading={loading}
                    fileUploaded={fileUploaded}
                    fileProcessed={fileProcessed}
                    fileStored={fileStored}
                    fileLink={fileLink}
                    imageUrl={imageUrl}
                    handleUpload={handleUpload}
                    handleOCR={handleOCR}
                    handleStorage={handleStorage} />
            </CardContent>
        </Card>
    )
}

export default InvoiceUploaderPresenter;
