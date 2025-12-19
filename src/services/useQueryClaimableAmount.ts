import { useQuery } from '@tanstack/react-query';
import { apiUser } from '@/services/api.ts';

export function useQueryClaimableAmount(type: 'DAILY' | 'INVITE' | 'PRO') {
  return useQuery({
    queryKey: ['claimable-amount', type],
    queryFn: async () => {
      const res = await apiUser.getClaimableAmount(type);
      return res.data;
    },
    refetchInterval: 30_000,
    refetchOnWindowFocus: 'always',
    refetchOnReconnect: 'always',
    refetchOnMount: 'always',
    retry: true,
    retryDelay: 3000,
  });
}
