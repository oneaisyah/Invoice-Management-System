import { Link } from "@mui/material";

const StorageLink = ({
    fileStored,
    fileLink
}) => {
    return (
        fileStored ? <Link href={fileLink}>Download stored image</Link>
            : ''
    )
}
export default StorageLink;