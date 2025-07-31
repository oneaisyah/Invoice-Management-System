import { Button } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useEffect } from "react";

const FileProcessButton = ({
    loading,
    fileProcessed,
    handleOCR
}) => {
    useEffect(() => {
        console.log('in fileprocess button', loading, fileProcessed);
    }, [loading, fileProcessed])
    return (
        <Button
            color={'secondary'}
            component={'span'}
            fullWidth
            variant={'contained'}
            onClick={handleOCR}
            id="process-file-button"
        >
            {(!loading && !fileProcessed) ? 'Process Image' : ''}
            {(loading && !fileProcessed) ? "Processing Image ..." : ''}
            {(fileProcessed) ?
                <>
                    < CheckCircleIcon style={{ marginRight: '8px' }} />
                    <span>image processed</span>
                </> : ''}
        </Button>
    )
}
export default FileProcessButton;