/** @format */

import { privateInstance, publicInstance } from "@/configs/axiosConfig";
import { useQuery } from "@tanstack/react-query";

interface QueryProps {
  isPublic?: boolean;
  url: string;
  params?: Record<string, any>;
  enabled?: boolean;
  queryKey?: string | (string | number)[];
}

// Add generic type <T> for expected return data shape
export const useGetQuery = <T = any,>({
  isPublic = false,
  url,
  params = {},
  enabled = true,
  queryKey,
}: QueryProps) => {
  const getData = async (): Promise<T> => {
    const instance = isPublic ? publicInstance : privateInstance;
    try {
      const response = await instance.get(url, { params });
      return response?.data?.data;
    } catch (err) {
      return Promise.reject(err);
    }
  };

  const key = queryKey ? queryKey : url;
  const { data, error, isLoading, refetch, isFetching, isSuccess, isError } =
    useQuery<T>({
      queryFn: getData,
      queryKey: [key, params, isPublic],
      enabled,
    });

  return {
    data,
    error,
    isLoading,
    isFetching,
    refetch,
    isSuccess,
    isError,
  };
};
