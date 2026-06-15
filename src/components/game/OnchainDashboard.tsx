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
         <ShieldAlert className="text-white/40 mb-2 animate-pulse" size={32} />
         <p className="text-[10px] text-white/50 uppercase tracking-widest text-center max-w-xs mb-4">
           Connecting to base mainnet...
         </p>
       </div>
     );
  }

  if (!isConnected) {
     return (
       <div className="flex flex-col items-center gap-4 py-4 w-full">
         <ShieldAlert className="text-white/40 mb-2" size={32} />
         <p className="text-[10px] text-white/50 uppercase tracking-widest text-center max-w-xs mb-4">
           Connect to base mainnet to record your epic runs.
         </p>
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
                  {isPending ? 'SIGNING...' : 'SIGN & RECORD ONCHAIN'}
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
