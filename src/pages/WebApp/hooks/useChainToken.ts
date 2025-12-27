import { useEffect, useMemo } from 'react';
import { useQueryConfig } from '@/services/useQueryConfig';
import { useLocalStore } from '@/store/useLocalStore';

/**
 * 获取当前链上代币的地址和标识信息
 * 自动从 appConfig 获取当前链配置，并将 symbol 存储到 localStore
 */
export function useChainToken() {
  const { data: appConfig, isLoading } = useQueryConfig();
  const { selectedChainId, tokenSymbol, setTokenSymbol } = useLocalStore();

  // 获取当前链的配置
  const chainConfig = useMemo(() => {
    return appConfig?.chains?.find((chain) => chain.chain_id === selectedChainId.toString());
  }, [appConfig, selectedChainId]);

  // eomo 代币地址
  const eomoAddress = chainConfig?.eomo as `0x${string}` | undefined;

  // USDT 地址
  const usdtAddress = chainConfig?.usdt as `0x${string}` | undefined;

  // 奖励合约地址
  const rewardContractAddress = chainConfig?.insight_reward_contract as `0x${string}` | undefined;

  // 当获取到链配置时，从配置中提取或设置默认 symbol
  useEffect(() => {
    if (chainConfig && !tokenSymbol) {
      // 默认使用 mEMO 作为代币符号
      setTokenSymbol('mEMO');
    }
  }, [chainConfig, tokenSymbol, setTokenSymbol]);

  return {
    // 代币地址
    eomoAddress,
    usdtAddress,
    rewardContractAddress,
    // 代币标识
    symbol: tokenSymbol ? `$${tokenSymbol}` : '$mEMO',
    rawSymbol: tokenSymbol || 'mEMO',
    // 设置 symbol 方法
    setTokenSymbol,
    // 加载状态
    isLoading,
    // 完整链配置
    chainConfig,
  };
}
