const express = require('express');
const {
  Connection,
  SystemProgram,
  LAMPORTS_PER_SOL,
  PublicKey,
} = '@solana/web3.js';
const { createAction } = require('@solana/actions');

const app = express();
const port = 3000;

// Configure CORS headers middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// The recipient's address
const RECIPIENT_ADDRESS = 'imbibed.sol';

// Create the transfer action
const transferAction = createAction({
  label: 'Send 0.1 SOL',
  description: 'Send 0.1 SOL to imbibed.sol',
  
  async prepare() {
    // Convert .sol domain to public key if needed
    // For this example, you'll need to replace this with the actual public key
    const recipientPubkey = new PublicKey(RECIPIENT_ADDRESS);
    
    return {
      instruction: SystemProgram.transfer({
        fromPubkey: null, // This will be filled in by the wallet
        toPubkey: recipientPubkey,
        lamports: 0.1 * LAMPORTS_PER_SOL
      })
    };
  }
});

// Serve the actions.json file
app.get('/actions.json', (req, res) => {
  res.json({
    actions: [
      {
        url: '/transfer',
        label: 'Send 0.1 SOL',
        description: 'Send 0.1 SOL to imbibed.sol'
      }
    ]
  });
});

// Handle the transfer action
app.get('/transfer', transferAction.handle);

app.listen(port, () => {
  console.log(`Action server running at http://localhost:${port}`);
}); 