import axios from 'axios';

const BASE_URL = 'https://wallet-system-5gzl.onrender.com/api/v1'; // Replace with your actual API endpoint

const apiService = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createWallet = async (walletData) => {
  try {
    const response = await apiService.post('/wallet/setup', walletData);
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Error Creating transactions. Please try again.';
    alert(errorMessage)
  }
};


export const getWallet = async ({walletId}) => {
    try {
      const response = await apiService.get(`/wallet/${walletId}`);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error Creating transactions. Please try again.';
      alert(errorMessage)
    }
  };

export const getTransactions = async ({walletId, skip, limit, sortBy, order}) => {
    try {
      const response = await apiService.get(`/transaction?walletId=${walletId}&skip=${skip}&limit=${limit}&order=${order}&sortBy=${sortBy}`);
      return response.data;
    } catch (error) {
      console.error('Error getting transactions: ', error);
        //   throw error;
        const errorMessage = error.response?.data?.message || 'Error getting transactions. Please try again.';
        alert(errorMessage)
    }
};

export const addTransaction = async ({amount, description, walletId}) => {
    try {
        const response = await apiService.post(`/transact/${walletId}`, {
            amount,
            description
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error Adding transactions. Please try again.';
        alert(errorMessage)
    }
}