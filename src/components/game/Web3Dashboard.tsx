import { useAccount, useConnect, useDisconnect, useSendTransaction, useSignMessage } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { generateGMTransactionData, appendERC8021Attribution } from '../../lib/erc8021';
import { Button } from '../ui/Button';
import { ShieldAlert, Send, FileSignature } from 'lucide-react';
import { parseEther } from 'viem';
import { useState } from 'react';

export function Web3Dashboard({ score }: { score?: number }) {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransaction, isPending: isTxPending, isSuccess: isTxSuccess } = useSendTransaction();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const handleConnect = () => {
    connect({ connector: injected() });
  };

  const handleSIWE = async () => {
    if (!address || score === undefined) return;
    try {
       setIsSigning(true);
       const domain = window.location.host;
       const message = `${domain} wants you to sign in with your Ethereum account:\n${address}\n\nSubmit Mythic Anvil Rush Score: ${score}\n\nURI: https://${domain}\nVersion: 1\nChain ID: 8453\nNonce: ${Math.random().toString(36).substring(7)}\nIssued At: ${new Date().toISOString()}`;
       
       const sig = await signMessageAsync({ account: address as `0x${string}`, message });
       setSignature(sig);
       
       // Optionally, after SIWE, record it on-chain
       const fakeCalldata = `0xscore${score.toString(16)}`; 
       sendTransaction({
           to: address, 
           value: parseEther('0'),
           data: appendERC8021Attribution(fakeCalldata as any)
       });
       
    } catch (err) {
       console.error("SIWE Failed", err);
    } finally {
       setIsSigning(false);
    }
  };

  const isPending = isTxPending || isSigning;
  const isSuccess = isTxSuccess || !!signature;

  if (!isConnected) {
     return (
       <div className="flex flex-col items-center gap-4 py-4 w-full">
         <ShieldAlert className="text-white/40 mb-2" size={32} />
         <p className="text-[10px] text-white/50 uppercase tracking-widest text-center max-w-xs mb-4">
           Connect to base mainnet to record your epic runs.
         </p>
         <Button variant="secondary" onClick={handleConnect} className="w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 uppercase tracking-widest text-[10px] font-bold">Connect Wallet</Button>
       </div>
     );
  }

  return (
      <div className="flex flex-col items-center gap-4 py-4 w-full">
         <div className="flex items-center justify-between w-full mb-4">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             <span className="text-[10px] font-mono text-white/60">BASE MAINNET</span>
           </div>
           <span className="text-[10px] font-mono text-white/40">{address?.slice(0,6)}...{address?.slice(-4)}</span>
         </div>
         
         <div className="flex flex-col gap-3 w-full">
            {score !== undefined && (
               <Button variant="mythic" onClick={handleSIWE} disabled={isPending} className="w-full py-3 bg-[#4facfe] rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(79,172,254,0.3)] hover:bg-[#4facfe]/90">
                  <FileSignature size={14} />
                  {isPending ? 'SIGNING...' : 'SIGN & RECORD ON-CHAIN'}
               </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={() => disconnect()} className="text-[10px] text-white/40 uppercase tracking-widest mt-2 hover:text-white/80">
               Disconnect
            </Button>

            {isSuccess && (
               <p className="text-[10px] font-mono text-center text-green-400 mt-2 uppercase tracking-widest">
                 Tx Submitted!
               </p>
            )}
         </div>
      </div>
  );
}
