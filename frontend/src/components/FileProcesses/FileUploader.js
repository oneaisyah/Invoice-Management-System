import { FormControl } from "@mui/material";
import FileBase from 'react-file-base64';

const FileUploader = ({ handleUpload }) => {
    return (
        <FormControl fullWidth margin="normal" id="file-uploader">
            <FileBase
                type="file"
                onDone={handleUpload}
                accept=".pdf"
            />
        </FormControl>
    );
}
export default FileUploader;