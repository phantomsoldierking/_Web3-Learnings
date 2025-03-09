const express = require('express');
const { Connection, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const axios = require('axios');

const app = express();
const PORT = 3000;

const ALCHEMY_RPC_URL = 'https://solana-devnet.g.alchemy.com/v2/aml41M4Va6CXOnePCStl5DRzVJAH1hNq';
const connection = new Connection(ALCHEMY_RPC_URL, 'finalized');

app.use(express.json());

// Function to manually confirm transaction
async function confirmTransaction(signature) {
    let retryCount = 0;
    const maxRetries = 30;

    while (retryCount < maxRetries) {
        const status = await connection.getSignatureStatus(signature, { searchTransactionHistory: true });
        if (status.value && status.value.confirmationStatus === 'finalized') {
            return true;
        }
        console.log(`Retrying confirmation... (${retryCount + 1}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        retryCount++;
    }
    throw new Error('Transaction not confirmed within time limit');
}

// Endpoint to airdrop SOL
app.post('/airdrop', async (req, res) => {
    const { walletAddress } = req.body;

    if (!walletAddress) {
        return res.status(400).json({ error: 'Wallet address is required' });
    }

    try {
        const publicKey = new PublicKey(walletAddress);
        
        // Request airdrop (high priority)
        const signature = await connection.requestAirdrop(
            publicKey,
            LAMPORTS_PER_SOL
        );

        console.log('Airdrop Transaction:', signature);

        // Manually confirm transaction
        await confirmTransaction(signature);

        res.json({
            success: true,
            signature,
            message: 'Airdrop successful! Check your balance.'
        });

    } catch (error) {
        console.error('Airdrop failed:', error.message);
        res.status(500).json({ error: 'Airdrop failed. Please try again.' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});

