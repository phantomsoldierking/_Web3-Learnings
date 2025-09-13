require("dotenv").config();
import express, { Request, Response } from "express";
import { burnToken, mintTokens, sendNativeToken } from "./mintTokens";
import bs58 from "bs58";
import { Keypair } from "@solana/web3.js";
import { PRIVATE_KEY, PUBLIC_KEY } from "./address";

const app = express();

app.use(express.json());

const vault = PUBLIC_KEY;

//@ts-ignore
app.post("/helius", async (req: Request, res: Response) => {
  const helius_response = req.body;

  const incomingTxn = helius_response.nativeTransfers?.find(
    (x: any) => x.toUserAccount === vault
  );

  if (!incomingTxn) {
    return res.status(400).send("No matching transfer to vault");
  }

  const fromAddress = incomingTxn.fromUserAccount;
  const toAddress = incomingTxn.toUserAccount;
  const amount = incomingTxn.amount;

  const type = "received_native_sol";
  try {
    if (type === "received_native_sol") {
      await mintTokens(fromAddress, amount);
    } else {
      await burnToken(fromAddress, amount);
      await sendNativeToken(toAddress, amount);
    }
    res.send("Transaction successful");
  } catch (err) {
    console.error("Error processing transaction:", err);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});