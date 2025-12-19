import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Key, Shield, Wifi } from 'lucide-react';
import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { tUSDTAbi } from '@/assets/tUSDT.ts';
import { InsightProVersionAbi } from '@/assets/InsightProVersion.ts';
import { InsightReward } from '@/assets/InsightReward.ts';
import { useUserStore } from '@/store/userStore.ts';
import { useQueryConfig } from '@/services/useQueryConfig.ts';
import { asciiToHex, getAppChainId } from '@/utils';
import { erc20Abi, formatEther, parseEther } from 'viem';
import toast from 'react-hot-toast';
import { getChainById } from '@/wallet/wagmi.ts';
import { apiPayment, apiUser } from '@/services/api.ts';
import { MintSigRes } from '@/services/model/types.ts';

interface TransactionModalProps {
  type: 'CLAIM_USDT' | 'CLAIM_PRO_DAILY' | 'CLAIM_TASK' | 'CLAIM_INVITE' | 'UPGRADE' | 'APPROVE';
  title: string;
  amount?: string;
  symbol?: string;
  proVersion?: number;
  cost?: string; // Gas or Price
  taskNonce?: number;
  onClose: () => void;
  onSuccess: () => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  type,
  title,
  amount,
  symbol,
  proVersion,
  cost,
  taskNonce,
  onClose,
  onSuccess,
}) => {
  const getWalletAddress = useUserStore((state) => state.getWalletAddress);
  const { writeContractAsync } = useWriteContract({});
  const { data: appConfig } = useQueryConfig();
  const { chain } = useAccount();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'review' | 'approve' | 'sign' | 'broadcast' | 'success'>(
    'review',
  );

  const { refetch: fetchAllowance } = useReadContract({
    abi: erc20Abi,
    address: getUSDTAddress(),
    functionName: 'allowance',
    args: [getWallet(), getInsightProAddress()],
  });

  useEffect(() => {
    if (step === 'success') {
      setTimeout(() => onSuccess(), 1500);
    }
  }, [step]); // eslint-disable-line react-hooks/exhaustive-deps

  function getWallet() {
    return getWalletAddress() as `0x${string}`;
  }

  function getUSDTAddress() {
    return appConfig.chains?.find((chain) => chain.chain_id === `${getAppChainId()}`)
      ?.usdt as `0x${string}`;
  }

  function getInsightProAddress() {
    return appConfig.chains?.find((chain) => chain.chain_id === `${getAppChainId()}`)
      ?.pro_version_contract as `0x${string}`;
  }

  function getInsightRewardAddress() {
    return appConfig.chains?.find((chain) => chain.chain_id === `${getAppChainId()}`)
      ?.insight_reward_contract as `0x${string}`;
  }

  async function mintUSDT() {
    const wallet = getWallet();
    const usdtAddress = getUSDTAddress();
    try {
      const tx = await writeContractAsync({
        abi: tUSDTAbi,
        address: usdtAddress,
        functionName: 'mint',
        args: [wallet, parseEther(amount)],
        chain: getChainById(getAppChainId()),
        account: wallet,
      });
      localStorage.setItem('mint_tusdt_hash', tx);
      setStep('success');
    } catch (e) {
      console.log(e);
      toast.error(`${e}`);
      setStep('review');
    }
  }

  async function upgradeProVersion() {
    try {
      const allowance = await fetchAllowance();
      const wallet = getWallet();
      const allowanceAmount = Number(cost) * 2;
      if (Number(formatEther(BigInt(allowance.data))) <= allowanceAmount) {
        setStep('approve');
        const tx = await writeContractAsync({
          abi: erc20Abi,
          address: getUSDTAddress(),
          functionName: 'approve',
          args: [getInsightProAddress(), parseEther(allowanceAmount.toString())],
          chain: getChainById(getAppChainId()),
          account: wallet,
        });
        console.log(`approve tx hash: ${tx}`);
      }
      setStep('sign');
      const txHash = await writeContractAsync({
        abi: InsightProVersionAbi,
        address: getInsightProAddress(),
        functionName: 'purchaseProVersion',
        args: [proVersion ?? 0],
        chain: getChainById(getAppChainId()),
        account: wallet,
      });
      await apiPayment.updatePayResult(txHash);
      setStep('success');
    } catch (e) {
      console.log(e);
      toast.error(`${e}`);
      setStep('review');
    }
  }

  async function claimProDaily() {
    try {
      const mintSigRes = await apiUser.getProMintSig({});
      const mintSig = mintSigRes.data;
      await execClaimMintTx(mintSig);
      setStep('success');
    } catch (e) {
      console.log(e);
      toast.error(`${e}`);
      setStep('review');
    }
  }

  async function claimTask(nonce: number | undefined) {
    try {
      const mintSigRes = await apiUser.getTaskMintSig({ nonce });
      const mintSig = mintSigRes.data;
      await execClaimMintTx(mintSig);
      setStep('success');
    } catch (e) {
      console.log(e);
      toast.error(`${e}`);
      setStep('review');
    }
  }

  async function claimInvite() {
    try {
      const mintSigRes = await apiUser.getInviteMintSig({});
      const mintSig = mintSigRes.data;
      await execClaimMintTx(mintSig);
      setStep('success');
    } catch (e) {
      console.log(e);
      toast.error(`${e}`);
      setStep('review');
    }
  }

  async function execClaimMintTx(mintSig: MintSigRes) {
    const tasksHex = asciiToHex(mintSig.tasks);
    const wallet = getWallet();
    const txHash = await writeContractAsync({
      abi: InsightReward,
      address: getInsightRewardAddress(),
      functionName: 'mintWithSignature',
      args: [
        wallet,
        ('0x' + mintSig.uuid) as `0x${string}`,
        BigInt(mintSig.nonce),
        BigInt(mintSig.timestamp),
        BigInt(mintSig.amount),
        ('0x' + tasksHex) as `0x${string}`,
        mintSig.signature as `0x${string}`,
      ],
      chain: getChainById(getAppChainId()),
      account: wallet,
    });
    await apiUser.submitClaimTxHash({ tx_hash: txHash, nonce: mintSig.nonce });
  }

  const handleConfirm = async () => {
    setLoading(true);
    switch (type) {
      case 'CLAIM_USDT':
        await mintUSDT();
        break;
      case 'UPGRADE':
        await upgradeProVersion();
        break;
      case 'CLAIM_PRO_DAILY':
        await claimProDaily();
        break;
      case 'CLAIM_TASK':
        await claimTask(taskNonce);
        break;
      case 'CLAIM_INVITE':
        await claimInvite();
        break;
      default:
        toast('unknown transaction type: ' + type + '');
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-[#0a0a0f] border border-tech-blue/30 relative overflow-hidden">
        {/* Cyberpunk Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-tech-blue" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-tech-blue" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-tech-blue" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-tech-blue" />

        <div className="p-1 bg-tech-blue/10 border-b border-tech-blue/20">
          <div className="flex justify-between items-center px-4 py-2">
            <span className="text-[10px] font-mono text-tech-blue tracking-widest">
              SECURE_CHANNEL_ESTABLISHED
            </span>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-tech-blue rounded-full animate-pulse" />
              <div className="w-1.5 h-1.5 bg-tech-blue/50 rounded-full" />
              <div className="w-1.5 h-1.5 bg-tech-blue/20 rounded-full" />
            </div>
          </div>
        </div>

        <div className="p-8 text-center">
          <AnimatePresence mode="wait">
            {step === 'review' && (
              <motion.div
                key="review"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="w-16 h-16 mx-auto bg-tech-blue/10 rounded-full flex items-center justify-center mb-6 border border-tech-blue/30">
                  <Shield size={32} className="text-tech-blue" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                <div className="space-y-4 my-8">
                  {amount && (
                    <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                      <span className="text-gray-400">Receive</span>
                      <span className="text-green-400 font-mono font-bold">
                        +{amount} {symbol ? symbol : ''}
                      </span>
                    </div>
                  )}
                  {cost && (
                    <div className="flex justify-between text-sm border-b border-white/10 pb-2">
                      <span className="text-gray-400">Est. Cost</span>
                      <span className="text-white font-mono">
                        {cost} {symbol ? symbol : ''}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Network</span>
                    <span className="text-tech-blue font-mono">{chain.name}</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 py-3 border border-white/20 text-gray-400 font-bold text-xs hover:bg-white/5 transition-colors uppercase"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={handleConfirm}
                    disabled={loading}
                    className="flex-1 py-3 bg-tech-blue text-black font-bold text-xs hover:bg-white transition-colors uppercase disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
                  >
                    {loading && (
                      <div className="absolute inset-0 bg-tech-blue/80 flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                      </div>
                    )}
                    <span className={loading ? 'invisible' : ''}>Confirm</span>
                  </button>
                </div>
              </motion.div>
            )}

            {(step === 'approve' || step === 'sign' || step === 'broadcast') && (
              <motion.div
                key="process"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative w-20 h-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-tech-blue rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    {step === 'approve' && <Shield size={24} className="text-tech-blue" />}
                    {step === 'sign' && <Key size={24} className="text-tech-blue" />}
                    {step === 'broadcast' && <Wifi size={24} className="text-tech-blue" />}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-widest">
                  {step === 'approve'
                    ? 'Requesting Approval'
                    : step === 'sign'
                      ? 'Signing Transaction'
                      : 'Broadcasting'}
                </h3>
                <p className="text-xs text-gray-500 font-mono">Please confirm in your wallet...</p>

                <div className="mt-8 flex justify-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${step === 'approve' ? 'bg-tech-blue' : 'bg-tech-blue/30'}`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full ${step === 'sign' ? 'bg-tech-blue' : 'bg-tech-blue/30'}`}
                  />
                  <div
                    className={`w-2 h-2 rounded-full ${step === 'broadcast' ? 'bg-tech-blue' : 'bg-tech-blue/30'}`}
                  />
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/30">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">TRANSACTION CONFIRMED</h3>
                <p className="text-sm text-gray-400 mb-8">Block #18293402</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
