import { React } from 'react';
import { FormControlLabel, Typography, TextField, Checkbox, Grid } from '@mui/material';
import SupplierAutocomplete from '../autocomplete/supplier';

const SOASearchFields = ({
    filter,
    setFilter,
}) => {
    const setFilterSupplier = (newSupplier) => {
        setFilter({ ...filter, supplier: newSupplier });
    }
    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>

                <Typography variant="h6" >
                    Statement Of Account Filters
                </Typography>
            </Grid>
            <Grid item xs={12}>
                <TextField
                    label="Reference Number"
                    value={filter.referenceNumber}
                    onChange={(e) => setFilter({ ...filter, referenceNumber: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='referenceNumberSearch'
                />
            </Grid>
            <Grid item xs={12}>
                <SupplierAutocomplete supplier={filter.supplier} setSupplier={setFilterSupplier} />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Min Date Issued"
                    type="date"
                    value={filter.minDateIssued}
                    onChange={(e) => setFilter({ ...filter, minDateIssued: new Date(e.target.value) })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    name='minDateIssuedSearch'
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Max Date Issued"
                    type="date"
                    value={filter.maxDateIssued}
                    onChange={(e) => setFilter({ ...filter, maxDateIssued: new Date(e.target.value) })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    name='maxDateIssuedSearch'
                />
            </Grid>

            <Grid item xs={3}>
                <TextField
                    label="Min Amount Outstanding"
                    type="number"
                    value={filter.minAmountOutstanding}
                    onChange={(e) => setFilter({ ...filter, minAmountOutstanding: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='minAmountOutstandingSearch'
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Max Amount Outstanding"
                    type="number"
                    value={filter.maxAmountOutstanding}
                    onChange={(e) => setFilter({ ...filter, maxAmountOustanding: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='maxAmountOutstandingSearch'
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Min Date Due"
                    type="date"
                    value={filter.minDateDue}
                    onChange={(e) => setFilter({ ...filter, minDateDue: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    name='minDateDueSearch'

                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Max Date Due"
                    type="date"
                    value={filter.maxDateDue}
                    onChange={(e) => setFilter({ ...filter, maxDateDue: e.target.value })}
                    fullWidth
                    margin="normal"
                    InputLabelProps={{ shrink: true }}
                    name='maxDateDueSearch'

                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Min Amount Overdue"
                    type="number"
                    value={filter.minAmountOverdue}
                    onChange={(e) => setFilter({ ...filter, minAmountOverdue: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='minAmountOverdueSearch'
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Max Amount Overdue"
                    type="number"
                    value={filter.maxAmountOverdue}
                    onChange={(e) => setFilter({ ...filter, maxAmountOverdue: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='maxAmountOverdueSearch'
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Min Amount Paid"
                    type="number"
                    value={filter.minAmountPaid}
                    onChange={(e) => setFilter({ ...filter, minAmountPaid: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='minAmountPaidSearch'
                />
            </Grid>
            <Grid item xs={3}>
                <TextField
                    label="Max Amount Paid"
                    type="number"
                    value={filter.maxAmountPaid}
                    onChange={(e) => setFilter({ ...filter, maxAmountPaid: e.target.value })}
                    fullWidth
                    margin="normal"
                    name='maxAmountPaidSearch'
                />
            </Grid>
        </Grid>
    )
}
export default SOASearchFields;