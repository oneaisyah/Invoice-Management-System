import { Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect } from "react";

const FileStoreButton = ({
    fileStored,
    handleStorage
}) => {
    useEffect(() => {
        console.log('in filestore button', fileStored);
    }, [fileStored])
    return (

        <Button
            color={'secondary'}
            component={'span'}
            fullWidth
            onClick={handleStorage}
            variant={'contained'}
            id="store-file-button"
        >
            {fileStored === true ? (
                <>
                    <CheckCircleIcon style={{ marginRight: '8px' }} />
                    <span>image stored</span>
                </>
            ) : (
                <span>store image</span>

            )}
        </Button>
    );
}
export default FileStoreButton;