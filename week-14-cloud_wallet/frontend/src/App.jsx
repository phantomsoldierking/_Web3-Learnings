import {
  PublicKey,
  Transaction,
  Connection,
  LAMPORTS_PER_SOL,
  SystemProgram,
} from "@solana/web3.js";
import "./App.css";
import axios from "axios";

//account which was created and stored in the database..!
const fromPubkey = new PublicKey(
  "28N2PYTSDqps6UFkqn3hSfzYgyn8x2fFs1FvJnhRU9bN"
);

const connection = new Connection(
  "https://api.devnet.solana.com"
);

function App() {
  async function sendSol() {
    const amount = parseFloat(document.getElementById("amount").value);
    if (isNaN(amount) || amount <= 0) {
      alert("Enter valid amount..!");
      return;
    }

    const key = document.getElementById("address").value;
    let toPubKey;
    try {
      toPubKey = new PublicKey(key);
    } catch (e) {
      console.log("Error: ", e);
      alert("Enter a valid public key!");
      return;
    }

    const ix = SystemProgram.transfer({
      fromPubkey: fromPubkey,
      toPubkey: toPubKey,
      lamports: amount * LAMPORTS_PER_SOL,
    });
    const tx = new Transaction().add(ix);

    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    tx.feePayer = fromPubkey;

    const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
      verifySignatures: false,
    });

    console.log("Serialized Transaction: ", serializedTransaction);

    await axios.post("http://localhost:3000/api/v1/txn/sign", {
      message: serializedTransaction,
      username: "phantom", 
      retry: false,
    });
  }
  return (
    <>
      <input id="amount" name="amount" type="text" placeholder="Amount"></input>
      <input
        id="address"
        name="address"
        type="text"
        placeholder="Address"
      ></input>
      <button onClick={sendSol}>Submit</button>
    </>
  );
}

export default App;