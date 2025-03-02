const { createMint } = require('@solana/spl-token');
const { Keypair, Connection, clusterApiUrl,  TOKEN_PROGRAM_ID } = require('@solana/web3.js');

const payer = Keypair.fromSecretKey(Uint8Array.from(EncodedVideoChunk.SOLANA_PrivateKey));

const mintAthority = payer;

const connection = new Connection(clusterApiUrl('devnet'));

async function createMintForToken(payer, mintAuthority) {
    const mint = await createMint(
        connection,
        payer,
        mintAuthority,
        null,
        6,
        TOKEN_PROGRAM_ID
    );
    console.log('Mint created at', mint.toBase58());
    return mint;
}

async function main() {
    const mint = await createMintForToken(payer, mintAthority.publicKey);
}

main();
