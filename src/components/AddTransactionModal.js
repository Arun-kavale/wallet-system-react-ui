// AddTransactionModal.js
import React, { useState } from 'react';
import { Modal, Backdrop, Fade, Button, TextField, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AddTransactionModal = ({ open, handleClose, handleSaveTransaction }) => {
    const [transactionType, setTransactionType] = useState('');

    const [amount, setAmount] = useState();
    const [description, setDescription] = useState();

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };

    const saveTransaction = () => {
        handleSaveTransaction({amount, description, type:transactionType});
        handleClose();
    }
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
            }}
        >
            <Fade in={open}>
            <Box
                sx={{
                position: 'absolute',
                top: '40%',
                left: '50%',
                transform: 'translate(-40%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                width: 400,
                }}
            >
                <Typography id="transition-modal-title" variant="h6" component="h2">
                    Add Transaction
                </Typography>
                <TextField label="Amount" variant="outlined" onChange={handleAmountChange} sx={{ mt: 2, mb: 2, width: '100%' }} />
                
                <TextField label="Description" variant="outlined" onChange={handleDescriptionChange} sx={{ mt: 2, mb: 2, width: '100%' }} />
                
                <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
                    <InputLabel id="transaction-type-label">Type</InputLabel>
                    <Select
                        labelId="transaction-type-label"
                        id="transaction-type"
                        value={transactionType}
                        onChange={(e) => setTransactionType(e.target.value)}
                        label="Type"
                    >
                        <MenuItem value="CREDIT">Credit</MenuItem>
                        <MenuItem value="DEBIT">Debit</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" color="primary" onClick={saveTransaction} sx={{ width: '100%' }}>
                    Save Transaction
                </Button>
            </Box>
            </Fade>
        </Modal>
    );
};

export default AddTransactionModal;