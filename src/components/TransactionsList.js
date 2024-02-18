// Transactions.js

import React, { useCallback, useEffect, useState } from 'react';
import { CSVLink } from 'react-csv';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Card, Button, TablePagination, CircularProgress, Typography, Chip } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { addTransaction, getTransactions } from '../service/appService';
import AddTransactionModal from './AddTransactionModal';

const styles = {
  card: {
    maxWidth: 800,
    margin: 'auto',
    padding: 20,
    marginTop: '25px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  exportButton: {
    margin: '10px 0',
    alignItems: 'right',
    marginRight: 0,
    marginLeft: '10px'
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
  error: {
    color: 'red',
    textAlign: 'center',
  },
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function Transactions() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [walletId, setWalletId] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();
  const [totalNumber, setTotalNumber] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [orderBy, setOrderBy] = useState('date'); // Default sorting column
  const [order, setOrder] = useState('asc'); // Default sorting order

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveTransaction = async ({ amount, description, type }) => {
    if (isNaN(amount)) {
      alert('Please add a valid amount number');
      return;
    }
    if (type === 'DEBIT' && amount > 0) {
      amount = amount * -1;
    }
    await addTransaction({ amount, description, walletId });
    await fetchTransactions();
    console.log('In handleSaveTransaction :: ', amount, ' :: ', description, ' :: ', type);
  }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setWalletId(params.get('walletId'));
  }, [location]);


  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const { transactions, totalNumber } = await getTransactions({
        walletId,
        skip: page * rowsPerPage,
        limit: rowsPerPage,
        sortBy: orderBy,
        order,
      });
      setTransactions(transactions);
      setTotalNumber(totalNumber);
      setError(null);
    } catch (error) {
      setError('Error fetching transactions. Please try again.');
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [walletId, page, rowsPerPage, orderBy, order]); // Add dependencies to the useCallback dependency array


  useEffect(() => {
    if (walletId) {
      fetchTransactions();
    }
  }, [walletId, page, rowsPerPage, orderBy, order, fetchTransactions]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSortRequest = (columnId) => {
    const isAsc = orderBy === columnId && order === '1';
    setOrder(isAsc ? '-1' : '1');
    setOrderBy(columnId);
  };

  const headers = [
    { label: 'Amount', key: 'amount' },
    { label: 'Date', key: 'date' },
    { label: 'Description', key: 'description' },
    { label: 'Type', key: 'type' },
    { label: 'Balance', key: 'balance' },
  ];

  return (
    <Card style={styles.card}>
      <Button variant="outlined" color="primary" style={styles.exportButton}>
        <CSVLink data={transactions} headers={headers} filename="transactions.csv">
          Export CSV
        </CSVLink>
      </Button>
      <Button variant="outlined" color="primary" style={styles.exportButton} onClick={handleOpenModal}>
        Add Transaction
      </Button>
      {loading && (
        <div style={styles.loading}>
          <CircularProgress />
        </div>
      )}
      {error && <Typography variant="body1" style={styles.error}>{error}</Typography>}
      {!loading && !error && transactions.length > 0 && (
        <div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align="center"
                    onClick={() => handleSortRequest('amount')}
                  >
                    Amount
                    {orderBy === 'amount' && (
                        <span>{order === '1' ? ' ↑' : ' ↓'}</span>
                    )}
                  </TableCell>
                  <TableCell
                    align="center"
                    onClick={() => handleSortRequest('date')}
                  >
                    Date
                    {orderBy === 'date' && (
                        <span>{order === '1' ? ' ↑' : ' ↓'}</span>
                    )}
                  </TableCell>
                  <TableCell
                    align="center"
                  >
                    Type
                  </TableCell>
                  <TableCell
                    align="center"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    align="center"
                  >
                    Balance
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((row) => (
                  <TableRow key={row._id}>
                    <TableCell align="center"><b>{row.amount}</b></TableCell>
                    <TableCell align="center">{formatDate(row.date)}</TableCell>
                    <TableCell align="center">{row.type === 'CREDIT' ? <Chip label="Credit" color="success" /> : <Chip label="Debit" color="error" />}</TableCell>
                    <TableCell align="center">{row.description}</TableCell>
                    <TableCell align="center">{row.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={totalNumber}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      )}

      <AddTransactionModal open={openModal} handleClose={handleCloseModal} handleSaveTransaction={handleSaveTransaction} />

    </Card>
  );
}

export default Transactions;
