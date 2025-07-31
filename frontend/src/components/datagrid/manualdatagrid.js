import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
} from '@mui/material';

const ExampleTable = () => {
    // Rows is the array that will be posted to the server
  const [rows, setRows] = useState([
    { id: 1, name: 'John Doe', age: 25 },
    { id: 2, name: 'Jane Smith', age: 30 },
  ]);
//   set the fields that are required for the database here
  const [newRow, setNewRow] = useState({ id: '', name: '', age: '' });

//  handleInputChange is used to update the state of the rows array
// only the cell that is being edited will be updated
  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedRows = [...rows];
    updatedRows[index][name] = value;
    setRows(updatedRows);
  };

  const handleAddRow = () => {
    setRows([...rows, newRow]);
    // change the fields that are required for the database here
    setNewRow({ id: '', name: '', age: '' });
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {/* Change the headers for the table here */}
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Age</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.id}>
              <TableCell>{row.id}</TableCell>
              <TableCell>
                <TextField
                  name="name"
                  value={row.name}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </TableCell>
              <TableCell>
                <TextField
                  name="age"
                  value={row.age}
                  onChange={(e) => handleInputChange(e, index)}
                />
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell>
              <TextField
                name="id"
                value={newRow.id}
                onChange={(e) => setNewRow({ ...newRow, id: e.target.value })}
              />
            </TableCell>
            <TableCell>
              <TextField
                name="name"
                value={newRow.name}
                onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
              />
            </TableCell>
            <TableCell>
              <TextField
                name="age"
                value={newRow.age}
                onChange={(e) => setNewRow({ ...newRow, age: e.target.value })}
              />
            </TableCell>
            <TableCell>
              <Button variant="contained" onClick={handleAddRow}>
                Add
              </Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ExampleTable;