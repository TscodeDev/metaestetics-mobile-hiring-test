import { useMemo } from 'react';
import { Clinic } from '@types';
import { mockApiService } from '@services';
import { useDataFetch, UseDataFetchResult } from './useDataFetch';

export interface UseClinicDataResult extends UseDataFetchResult<Clinic[]> {}

export const useClinicData = (searchQuery: string): UseClinicDataResult => {
  const trimmedQuery = searchQuery.trim();

  const { key, fetchFn } = useMemo(() => {
    if (trimmedQuery.length === 0) {
      return {
        key: 'clinics/all',
        fetchFn: async () => {
          const response = await mockApiService.getClinics();
          return response.clinics;
        },
      };
    }

    return {
      key: `clinics/search?query=${trimmedQuery.toLowerCase()}`,
      fetchFn: async () => {
        const response = await mockApiService.searchClinics(trimmedQuery);
        return response.clinics;
      },
    };
  }, [trimmedQuery]);

  return useDataFetch<Clinic[], void>(key, fetchFn, undefined, {
    enableCache: true,
  });
};

