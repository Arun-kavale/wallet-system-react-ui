import { Button, Card, CircularProgress, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getWallet } from '../service/appService';

const styles = {
  card: {
    maxWidth: 400,
    margin: 'auto',
    padding: 20,
    marginTop: '25px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer', // Add pointer cursor for clickability
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)', // Add a subtle scale effect on hover
    },
  },
  cardBody: {
    textAlign: 'center',
  },
  walletName: {
    fontSize: 24,
    marginBottom: 10,
  },
  walletCardBody: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: 18,
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
  buttonContainer: {
    textAlign: 'center', // Center the button
    marginTop: '30px', // Add some margin for spacing
  },
  fullSizeButton: {
    width: '100%', // Make the button full-width
  },
};

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function WalletDetails({ wallet }) {
  const navigate = useNavigate();
  const [walletData, setWalletData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCardClick = () => {
    // navigate(`/transactions?walletId=${wallet._id}`);
  };

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        setLoading(true);
        const walletResponse = await getWallet({ walletId: wallet._id });
        setWalletData(walletResponse);
      } catch (error) {
        setError('Error fetching wallet details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (wallet?._id) {
      fetchWalletData();
    }
  }, [wallet]);

  const handleOpenTransactions = () => {
    navigate(`/transactions?walletId=${wallet._id}`);
  };

  return (
    <Card style={styles.card} onClick={handleCardClick}>
      <div style={styles.cardBody}>
        <h3 style={styles.walletName}>{walletData?.name}</h3>
        {loading && (
          <div style={styles.loading}>
            <CircularProgress />
          </div>
        )}
        {error && (
          <Typography variant="body1" style={styles.error}>
            {error}
          </Typography>
        )}
        {!loading && !error && (
          <div style={styles.walletCardBody}>
            <span>Balance: <b>{walletData?.balance}</b></span>
            <span>Date: {formatDate(walletData?.date)}</span>
          </div>
        )}
        <div style={styles.buttonContainer}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleOpenTransactions}
            style={styles.fullSizeButton}
          >
            Open Transactions
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default WalletDetails;