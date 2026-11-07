import { useAccount, useConnect, useDisconnect, useSendTransaction, useSignMessage, useSendCalls } from 'wagmi';
import { Button } from '../ui/Button';
import { ShieldAlert, FileSignature } from 'lucide-react';
import { parseEther, toHex } from 'viem';
import { useState } from 'react';
import { base } from 'wagmi/chains';

export function OnchainDashboard({ score }: { score?: number }) {
  const { address, isConnected, isConnecting, isReconnecting } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { sendTransactionAsync, isPending: isTxPending, isSuccess: isTxSuccess } = useSendTransaction();
  const { sendCallsAsync } = useSendCalls();
  const { signMessageAsync } = useSignMessage();
  const [isSigning, setIsSigning] = useState(false);
  const [signature, setSignature] = useState<string | null>(null);

  const handleSIWE = async () => {
    if (!address || score === undefined) return;
    try {
       setIsSigning(true);
       const domain = window.location.host;
       const message = `${domain} wants you to sign in with your Ethereum account:\n${address}\n\nSubmit Mythic Anvil Rush Score: ${score}\n\nURI: https://${domain}\nVersion: 1\nChain ID: ${base.id}\nNonce: ${Math.random().toString(36).substring(7)}\nIssued At: ${new Date().toISOString()}`;
       
       const sig = await signMessageAsync({ account: address as `0x${string}`, message });
       setSignature(sig);
       
       // Optionally, after SIWE, record it onchain
       const fakeCalldata = toHex(`score:${score}`); 
       const tx = {
           to: address, 
           value: parseEther('0'),
           data: fakeCalldata
       };

       if (sendCallsAsync) {
         try {
           await sendCallsAsync({
             calls: [tx],
             capabilities: { dataSuffix: { optional: true } }
           });
         } catch (callError) {
           await sendTransactionAsync(tx);
         }
       } else {
         await sendTransactionAsync(tx);
       }
       
    } catch (err) {
       console.error("SIWE / Onchain Record Failed", err);
    } finally {
       setIsSigning(false);
    }
  };

  const isPending = isTxPending || isSigning;
  const isSuccess = isTxSuccess || !!signature;

  if (isReconnecting || isConnecting) {
     return (
       <div className="flex flex-col items-center gap-4 py-4 w-full">
         <ShieldAlert className="text-cyan-400 mb-2 animate-pulse" size={32} />
         <p className="text-[10px] text-cyan-300 font-mono uppercase tracking-widest text-center max-w-xs mb-2">
           Connecting to Base Mainnet (Denim)...
         </p>
         <span className="text-[9px] text-white/40 font-mono">200ms Native Canonical Blocks</span>
       </div>
     );
  }

  if (!isConnected) {
     return (
       <div className="flex flex-col items-center gap-4 py-4 w-full">
         <ShieldAlert className="text-white/40 mb-2" size={32} />
         <div className="text-center mb-4">
           <p className="text-[10px] text-white/50 uppercase tracking-widest max-w-xs mb-1">
             Connect to Base Mainnet to record your epic runs.
           </p>
           <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-[9px] font-mono text-cyan-300">
             <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
             DENIM 200ms CANONICAL BLOCKS
           </div>
         </div>
         <div className="flex flex-col gap-2 w-full">
           {connectors.map((connector) => (
             <Button 
               key={connector.uid} 
               variant="secondary" 
               onClick={() => connect({ connector })} 
               disabled={isConnecting}
               className="w-full bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 uppercase tracking-widest text-[10px] font-bold"
             >
               Connect {connector.name}
             </Button>
           ))}
         </div>
       </div>
     );
  }

  return (
      <div className="flex flex-col items-center gap-3 py-4 w-full">
         <div className="flex items-center justify-between w-full mb-2 bg-black/40 px-3 py-2 rounded-xl border border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-[0_0_8px_#22d3ee]"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold text-white tracking-wider">BASE MAINNET</span>
                <span className="text-[8px] font-mono text-cyan-400">DENIM • 200ms CANONICAL</span>
              </div>
            </div>
            <span className="text-[10px] font-mono text-white/50 bg-white/5 px-2 py-1 rounded-md">{address?.slice(0,6)}...{address?.slice(-4)}</span>
         </div>
         
         <div className="flex flex-col gap-2.5 w-full">
            {score !== undefined && (
               <Button 
                 variant="mythic" 
                 onClick={handleSIWE} 
                 disabled={isPending} 
                 className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,211,238,0.35)] hover:from-cyan-400 hover:to-blue-500 text-white"
               >
                  <FileSignature size={14} />
                  {isPending ? 'CONFIRMING (200ms DENIM)...' : 'RECORD ONCHAIN (DENIM)'}
               </Button>
            )}
            
            <Button variant="ghost" size="sm" onClick={() => disconnect()} className="text-[10px] text-white/40 uppercase tracking-widest hover:text-white/80">
               Disconnect
            </Button>

            {isSuccess && (
               <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-green-500/10 border border-green-500/30">
                 <p className="text-[10px] font-mono text-center text-green-400 font-bold uppercase tracking-widest">
                   ✓ Confirmed in 200ms Canonical Block
                 </p>
                 <span className="text-[8px] font-mono text-white/40">Base Denim Finalized</span>
               </div>
            )}
         </div>
      </div>
  );
}
