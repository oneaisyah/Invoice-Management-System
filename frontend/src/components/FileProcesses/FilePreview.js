
const FilePreview = ({
    fileUploaded,
    imageUrl
}) => {
    return (
        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>

            {fileUploaded ?
                <object data={imageUrl} type="application/pdf" width="100%" height="600" alt="Receipt">.</object>
                : ''}
        </div>
    );
}
export default FilePreview;