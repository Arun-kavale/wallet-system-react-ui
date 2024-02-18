import { Button, Card, CircularProgress, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { createWallet } from '../service/appService';
import WalletDetails from './WalletDetails';

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '25px',
  },
  card: {
    padding: '20px',
    width: '350px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    marginTop: '10px',
    width: '100%', 
  },
  testField: {
    marginBottom: '20px',
    width: '100%', 
  },
  loader: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '20px',
  },
  walletCardBody: {
    display: 'flex',
    flexDirection: 'row',
  },
};

function Wallet({ onWalletCreation }) {
  const [walletName, setWalletName] = useState('');
  const [wallet, setWallet] = useState({});
  const [initialBalance, setInitialBalance] = useState('');
  const [walletId, setWalletId] = useState('');
  const [loading, setLoading] = useState(false); // New state for loading

  const handleWalletCreation = async () => {
    setLoading(true); 

    if (initialBalance && (isNaN(initialBalance) || Number(initialBalance) < 0)) {
      alert('Invalid Initial balance');
      setLoading(false); 
      return;
    }

    try {
      const wallet = await createWallet({
        name: walletName,
        balance: initialBalance,
      });

      if (wallet?._id) {
        setWalletId(wallet._id);
        setWallet(wallet);
        localStorage.setItem('wallet', JSON.stringify(wallet));
        setLoading(false); 
      }
    } catch (error) {
      console.error('Error creating wallet:', error);
      setLoading(false); 
    }
  };

  const handleInitialBalanceChange = (event) => {
    const value = event.target.value;
    setInitialBalance(value);
  };

  const handleWalletNameChange = (event) => {
    setWalletName(event.target.value);
  };

  useEffect(() => {
    const walletData = localStorage.getItem('wallet');
    if (walletData) {
      setWallet(JSON.parse(walletData));
    }
  }, []);

  useEffect(() => {
    setInitialBalance(wallet.balance);
    setWalletId(wallet._id);
    setWalletName(wallet.name);
  }, [wallet]);

  return (
    <div>
      {!walletId ? (
        <div style={styles.container}>
          <Card style={styles.card}>
            <div style={styles.cardBody}>
              <h3>Add New Wallet</h3>
              <TextField
                id="outlined-basic"
                label="Wallet Name"
                autoComplete="off"
                variant="outlined"
                onChange={handleWalletNameChange}
                style={styles.testField}
              />
              <TextField
                id="outlined-basic"
                label="Balance"
                autoComplete="off"
                variant="outlined"
                onChange={handleInitialBalanceChange}
                style={styles.testField}
              />
              <Button variant="outlined" onClick={handleWalletCreation} style={styles.button}>
                {loading ? <CircularProgress size={24} /> : 'Add Wallet'}
              </Button>
              
            </div>
          </Card>
        </div>
      ) : (
        <WalletDetails wallet={wallet} />
      )}
    </div>
  );
}

export default Wallet;
