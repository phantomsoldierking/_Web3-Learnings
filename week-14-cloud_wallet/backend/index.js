const express = require("express");
const { userModel } = require("./model");
const {
  Connection,
  clusterApiUrl,
  Keypair,
  Transaction,
} = require("@solana/web3.js");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = "1234567";
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const signupSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
});

app.post("/api/v1/signup", async (req, res) => {
  try {
    const parsed = signupSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({
        message: z.treeifyError(err), // OR parsed.error.flatten().fieldErrors
      });
    }

    const { username, password } = parsed.data;

    const existingUser = await userModel.findOne({
      username,
    });
    if (existingUser) {
      res.json({
        message: "Username already exists..!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const keyPair = new Keypair();
    console.log(keyPair)
    await userModel.create({
      username,
      password: hashedPassword,
      privateKey: Buffer.from(keyPair.secretKey).toString("base64"),
      publicKey: keyPair.publicKey.toBase58(),
    });
    res.json({
      message: "User created successfully",
      publicKey: keyPair.publicKey.toBase58(),
    });
  } catch (error) {
    console.log("Signup Error: ", error);
    res.status(500).json({
      error: "Internal Server Error..!",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  const user = await userModel.findOne({
    username: username,
    password: password,
  });

  if (user) {
    const token = jwt.sign(
      {
        id: user,
      },
      JWT_SECRET
    );
    res.json({
      token,
    });
  } else {
    res.status(403).json({
      message: "Credentials are incorrect..!",
    });
  }
});

app.post("/api/v1/txn/sign", async (req, res) => {
  try {
    const serializedTx = req.body.message;
    const username = req.body.username; // or auth token..!

    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const secretKeyBytes = Buffer.from(user.privateKey, "base64");
    const keypair = Keypair.fromSecretKey(secretKeyBytes);

    const transaction = Transaction.from(Buffer.from(serializedTx.data));

    const { blockhash } = await connection.getLatestBlockhash();
    transaction.blockhash = blockhash;
    transaction.feePayer = keypair.publicKey;

    transaction.sign(keypair);

    const signature = await connection.sendTransaction(transaction, [keypair]);
    console.log(signature);

    return res.json({
      message: "Transaction signed and submitted successfully",
      signature: signature,
    });
  } catch (error) {
    console.error("Transaction signing error:", error);
    res.status(500).json({
      error: "Failed to sign transaction",
    });
  }
});

app.get("/api/v1/txn", async (req, res) => {
  const signature = req.query.id.replace(/["']/g, "").trim();

  if (!signature) {
    return res.status(400).json({
      error: "Missing transaction signature (id)",
    });
  }

  try {
    const { value } = await connection.getSignatureStatuses([signature]);
    const statusInfo = value[0];

    if (statusInfo) {
      let status;
      if (
        statusInfo.confirmationStatus === "finalized" &&
        statusInfo.err === null
      ) {
        status = "success";
      } else if (statusInfo.err) {
        status = "failed";
      } else {
        status = "processing";
      }

      return res.json({
        message: `Can check your Transaction on https://explorer.solana.com/tx/${signature}?cluster=devnet`, //remove cluster=devnet for mainnet..!
        signatures: [signature],
        status,
      });
    }

    const tx = await connection.getTransaction(signature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    });

    if (tx) {
      const err = tx.meta?.err;
      return res.json({
        message: `Can check your Transaction on https://explorer.solana.com/tx/${signature}?cluster=devnet`, //remove cluster=devnet for mainnet..!
        signatures: [signature],
        status: err ? "failed" : "success",
      });
    }

    return res.status(404).json({
      error: "Transaction not found",
    });
  } catch (error) {
    console.error("Error fetching transaction status:", error);
    res.status(500).json({
      error: "Failed to fetch transaction status",
    });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port http://localhost:3000");
});