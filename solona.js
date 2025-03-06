const { LAMPORTS_PER_SOL } = require("@solana/web3.js")

console.log(LAMPORTS_PER_SOL)

const express = require("express");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

const ALCHEMY_RPC_URL = "https://solana-mainnet.g.alchemy.com/v2/aml41M4Va6CXOnePCStl5DRzVJAH1hNq";
const publicKey = "Eg4F6LW8DD3SvFLLigYJBFvRnXSBiLZYYJ3KEePDL95Q"

app.get("/getAccountInfo", async (req, res) => {
    try {
        if (!publicKey) {
            return res.status(400).json({ error: "Missing publicKey query parameter" });
        }

        const requestData = {
            jsonrpc: "2.0",
            id: 1,
            method: "getAccountInfo",
            params: [publicKey]
        };

        const response = await axios.post(ALCHEMY_RPC_URL, requestData, {
            headers: { "Content-Type": "application/json" }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/getBalance", async (req, res) => {
    try{
        if (!publicKey) {
            return res.status(400).json({ error: "Missing publicKey query parameter" });
        }

        const requestData = {
            jsonrpc: "2.0",
            id: 1,
            method: "getBalance",
            params: [publicKey]
        };

        const response = await axios.post(ALCHEMY_RPC_URL, requestData, {
            headers: { "Content-Type": "application/json" }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get("/transactionCount", async (req, res) => {
    try {
        const requestData = {
            "jsonrpc": "2.0",
            "id": 1,
            "method": "getTransactionCount"
          };

        const response = await axios.post(ALCHEMY_RPC_URL, requestData, {
            headers: { "Content-Type": "application/json" }
        });

        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
