import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  IconButton,
  TableContainer,
  TablePagination,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { toast } from 'react-hot-toast';
import User from '../components/apiWrapper/User';
import Authentication from '../components/apiWrapper/Authentication';
// components
import Label from '../components/label';
import Iconify from '../components/iconify';
import Scrollbar from '../components/scrollbar';
// sections
import { UserListHead } from '../sections/@dashboard/user';
// mock
// import USERLIST from '../_mock/user';

let USERLIST;

// ----------------------------------------------------------------------

// Users data is imported from USERLIST ABOVE

const TABLE_HEAD = [
  { id: 'name', label: 'Name', alignRight: false },
  { id: 'permission', label: 'Permission', alignRight: false },
  { id: 'password', label: 'Password', alignRight: false },
  { id: 'changePassword', label: '', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function UserPage() {
  const [open, setOpen] = useState(null);

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  // to save USERLIST state
  const [userList, setUserList] = useState([]);


  const [seeAble, setSeeAble] = useState(false);

  const [seeNewUser, setSeeNewUser] = useState(true);

  const [passwordFields, setPasswordFields] = useState({});

  const [openDialog, setOpenDialog] = useState(false);

  const [userIDToDelete, setUserIDToDelete] = useState(null);

  const handleDeleteClick = (userID) => {
    setUserIDToDelete(userID);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {


    try {
      const response = await User.delete(userIDToDelete)

      if (!response) {
        setSeeAble(false);
        toast.error('An error occurred during deletion!', { duration: 2000 });
      } else {
        const localStorageUserToken = JSON.parse(localStorage.getItem('user')).token;
        await updateUserData(localStorageUserToken);
        setOpenDialog(false);

        toast.success('User deleted successfully!', {
          duration: 2000,
          className: 'delete-user-success-toast'
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred! User was not deleted!', { duration: 2000 });
    }


  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const checkIfPageIsVisitable = async () => {
    try {

      const response = await Authentication.authenticate();
      // Ideally response === {msg, username, roleLevel}

      if (response) {
        if (response.roleLevel === 0) {
          setSeeNewUser(false);
        }
        if (response.roleLevel >= 2) {
          setSeeAble(true);
        } else {
          toast.error('Your role level is too low to view page!\nUsers are hidden from your view!', {
            duration: 5000,
            className: 'view-user-failure-toast'
          });

        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const updateUserData = async () => {
    try {

      const response = await User.getAll();

      await setUserList(response);

    } catch (error) {

      console.error('Error:', error);
    }
  };


  const handleOpenMenu = (event) => {
    setOpen(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpen(null);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = USERLIST.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };


  const handleEditPasswordClick = (userId) => {
    setPasswordFields((prevFields) => ({
      ...prevFields,
      [userId]: {
        visible: !prevFields[userId]?.visible || false,
        newPassword: prevFields[userId]?.newPassword || '',
      },
    }));
  };

  const handleSavePassword = async (userID) => {
    const userDataToUpdate = userList.find(user => user._id === userID);
    const updatedData = {
      password: passwordFields[userID].newPassword
    };

    try {
      await User.put(userID, updatedData);

      //* Refresh the front-end data if update was successful
      const updatedUserList = userList.map(user => {
        if (user._id === userID) {
          return { ...user };
        }
        return user;
      });
      setUserList(updatedUserList);
      setPasswordFields('');

      toast.success('Password updated successfully!', {
        duration: 2000,
        className: 'update-password-success-toast'
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('An error occurred while updating the password.', { duration: 2000 });
    }
  };



  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - userList.length) : 0;

  // ... (previous imports)


  // ... (export UserListHead as before)

  useEffect(() => {
    checkIfPageIsVisitable();
    updateUserData();

  }, [])

  if (!userList) {
    return <div>Loading...</div>;
  }
  const filteredUsers = applySortFilter(userList, getComparator(order, orderBy), filterName);
  const isNotFound = !filteredUsers.length && !!filterName;


  return (
    <>
      <Helmet>
        <title> User</title>
      </Helmet>
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            User
          </Typography>
          {seeNewUser && <Button to="/registration" variant="contained" component={Link} startIcon={<Iconify icon="eva:plus-fill" id='add-new-user-button' />}>
            New User
          </Button>}
        </Stack>
        <Card>

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={userList.length}
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                />
                {seeAble &&
                  <TableBody className='user-table'>
                    {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { _id, username, roleLevel } = row;
                      const selectedUser = selected.indexOf(username) !== -1;

                      return (
                        <TableRow hover key={_id} tabIndex={-1}>

                          <TableCell component="th" scope="row" >
                            <Stack direction="row">
                              <Typography variant="subtitle2" alignItems="center">
                                {username}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">

                            {roleLevel === 0 && 'Staff'}
                            {roleLevel === 1 && 'Branch manager'}
                            {roleLevel === 2 && 'Administrator'}
                            {roleLevel === 3 && 'Super administrator'}

                          </TableCell>
                          <TableCell align="left">

                            <Stack direction="row" alignItems="center" spacing={1}>
                              <Button variant="contained" color="primary" onClick={() => handleEditPasswordClick(_id)} id='edit-password-button'>
                                Edit Password
                              </Button>
                            </Stack>
                          </TableCell>

                          {passwordFields[_id]?.visible && (
                            <TableCell align="left">
                              <Stack direction="row" alignItems="center" spacing={1}>

                                <TextField
                                  size="small"
                                  name="newPassword"
                                  label="Enter a new password"
                                  type="password"
                                  value={passwordFields[_id]?.newPassword}
                                  onChange={(e) =>
                                    setPasswordFields((prevFields) => ({
                                      ...prevFields,
                                      [row._id]: {
                                        ...prevFields[row._id],
                                        newPassword: e.target.value,
                                      },
                                    }))
                                  }
                                />

                                <Button variant="contained" color="primary" onClick={() => handleSavePassword(_id)} id='save-password-button'>
                                  Save
                                </Button>
                              </Stack>
                            </TableCell>
                          )}

                          <TableCell align="center">
                            <Stack direction="row" alignItems="center" justifyContent="center">
                              <Iconify
                                icon={'eva:trash-2-outline'}
                                onClick={() => handleDeleteClick(_id)}
                                style={{ cursor: 'pointer' }}
                                id='delete-user-button'
                              />
                            </Stack>
                          </TableCell>

                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={4} />
                      </TableRow>
                    )}
                  </TableBody>}

                {isNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={4} sx={{ py: 3 }}>
                        <Paper
                          sx={{
                            textAlign: 'center',
                          }}
                        >
                          <Typography variant="h6" paragraph>
                            Not found
                          </Typography>

                          <Typography variant="body2">
                            No results found for &nbsp;
                            <strong>&quot;{filterName}&quot;</strong>.
                            <br /> Try checking for typos or using complete words.
                          </Typography>
                        </Paper>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={userList.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            p: 1,
            width: 140,
            '& .MuiMenuItem-root': {
              px: 1,
              typography: 'body2',
              borderRadius: 0.75,
            },
          },
        }}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} id='delete-user-dialog'>
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary" id='confirm-delete-user-button'>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );


}