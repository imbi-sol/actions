import { getDomainKey, NameRegistryState } from "@bonfida/sns-sdk";

const action = {
  label: 'Send 0.1 SOL',
  description: 'Send 0.1 SOL to imbibed.sol',
  
  async prepare() {
    const RECIPIENT_DOMAIN = 'imbibed.sol';
    
    try {
      // Create connection to Solana mainnet
      const connection = new solanaWeb3.Connection(
        solanaWeb3.clusterApiUrl('mainnet-beta')
      );

      // Get the domain key and registry state
      const { pubkey } = await getDomainKey(RECIPIENT_DOMAIN);
      const registry = await NameRegistryState.retrieve(connection, pubkey);
      
      if (!registry || !registry.owner) {
        throw new Error('Domain not found or has no owner');
      }

      const recipientPubkey = registry.owner;
      
      return {
        instruction: solanaWeb3.SystemProgram.transfer({
          fromPubkey: null, // Will be filled by wallet
          toPubkey: recipientPubkey,
          lamports: 0.1 * solanaWeb3.LAMPORTS_PER_SOL
        })
      };
    } catch (error) {
      console.error('Error resolving .sol domain:', error);
      throw new Error('Failed to resolve .sol domain');
    }
  }
};

// Register the action
if (window.location.pathname === '/transfer') {
  solanaActions.handleAction(action);
} 