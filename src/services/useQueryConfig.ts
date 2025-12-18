import { useQuery } from '@tanstack/react-query';
import { apiUser } from '@/services/api.ts';

export function useQueryConfig() {
  return useQuery({
    queryKey: ['app-config'],
    queryFn: async () => {
      const res = await apiUser.getAppConfig();
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
