import { Button } from "@mui/material";
import ProductFormFields from "./FormFields";

const ProductForm = ({
    name,
    setName,
    upc,
    setUpc,
    handleSubmit
}) => {
    return (
        <form onSubmit={handleSubmit} >
            <ProductFormFields
                name={name}
                setName={setName}
                upc={upc}
                setUpc={setUpc} />

            <Button type="submit" variant="contained" color="primary" id='product-submit-button'>
                Submit
            </Button>
        </form>)
};
export default ProductForm;