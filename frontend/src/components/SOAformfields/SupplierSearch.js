import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import ChosenItem from './supplier/ChosenItem';
import SupplierSearchFields from './supplier/SupplierSearchFields';
import FixedItemTable from './supplier/FixedItemTable';

const SupplierSearch = ({ supplier, setSupplier }) => {
  const [filter, setFilter] = useState({
    name: null,
    address: null
  });
  const [chosenSupplier, setChosenSupplier] = useState(null);
  const [addingSupplier, setAddingSupplier] = useState(false);
  const [supplierChosen, setSupplierChosen] = useState(false);
  const handleAddClick = () => {
    setSupplier(chosenSupplier);
    alert(`Chose supplier ${chosenSupplier.name} successfully!`);

  }
  const handleShowClick = () => {
    setAddingSupplier(!addingSupplier);
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" >
          Chosen Supplier
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <ChosenItem supplier={supplier} />
      </Grid>
      {addingSupplier ?
        <Grid item xs={12}>
          <SupplierSearchFields filter={filter} setFilter={setFilter} />
        </Grid> : null}
      {addingSupplier ?
        <Grid item xs={12}>
          <Typography variant="h6" >
            Supplier Search Results
          </Typography>
        </Grid> : null}
      {addingSupplier ?
        <Grid item xs={12}>
          <FixedItemTable filter={filter} setChosenSupplier={setChosenSupplier}
            setSupplierChosen={setSupplierChosen} />
        </Grid> : null}
      {addingSupplier && supplierChosen ?
        <Grid item xs={2.5}>
          <Button onClick={handleAddClick} variant="contained" id='confirm-add-supplier-button'> Confirm</Button>
        </Grid> : null}

      <Grid item xs={3.4}>
        <Button onClick={handleShowClick} variant="outlined" id='choose-supplier-button'>{addingSupplier ? "Cancel" : "Choose Supplier"}</Button>
      </Grid>
    </Grid >
  );
};

export default SupplierSearch;
