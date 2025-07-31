import { Card, CardContent, IconButton } from '@mui/material'
import { RotateLeft, RotateRight } from '@mui/icons-material';
import SOAUploaderUnit from './SOAUploaderUnit';

const SOAUploaderPresenter = ({
    loading,
    fileUploaded,
    fileStored,
    fileLink,
    file,
    imageUrl,
    handleUpload,
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
                <SOAUploaderUnit
                    loading={loading}
                    fileUploaded={fileUploaded}
                    fileStored={fileStored}
                    fileLink={fileLink}
                    file={file}
                    imageUrl={imageUrl}
                    handleUpload={handleUpload}
                    handleStorage={handleStorage} />
            </CardContent>
        </Card>
    )
}

export default SOAUploaderPresenter;