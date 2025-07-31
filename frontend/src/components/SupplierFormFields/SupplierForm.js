import { Button } from "@mui/material";
import SupplierFormFields from "./FormFields";

const SupplierForm = ({
    name,
    setName,
    address,
    setAddress,
    uen,
    setUen,
    handleSubmit
}) => {
    return (
        <form onSubmit={handleSubmit} >
            <SupplierFormFields
                name={name}
                setName={setName}
                address={address}
                setAddress={setAddress}
                uen={uen}
                setUen={setUen} />

            <Button type="submit" variant="contained" color="primary" id='supplier-submit-button'>
                Submit
            </Button>
        </form>)
};
export default SupplierForm;