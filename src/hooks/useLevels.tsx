import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query'; // Import useQuery từ react-query
import { Level_API } from '../services/modules/LevelServices';
import { Meta } from '../types';

type Level = {
  _id: string;
  name: string;
  key: string;
  description: string;
};

export const useLevels = (page: number = 1, pageSize: number = 10) => {
  const [data, setData] = useState<Level[]>([]);
  const [meta, setMeta] = useState<Meta>({});
  const user = useSelector((state: any) => state.user);

  // Sử dụng useQuery để thay thế logic gọi API thủ công
  const { data: fetchedData, refetch, isLoading, isError } = useQuery({
    queryKey: ['levels', page, pageSize], // Thêm page và pageSize vào queryKey
    queryFn: async () => {
      if (!user?._id) {
        throw new Error('User not authenticated');
      }
      const response = await Level_API.getAll(
        {
          page,
          pageSize,
          // query: { user_id: user._id },
        },
        user?.access_token
      );
      return response.data; // Trả về dữ liệu từ API
    },
    enabled: !!user?._id, // Chỉ chạy khi có user_id
    staleTime: 5 * 60 * 1000, // Dữ liệu cache sẽ stale sau 5 phút
    cacheTime: 10 * 60 * 1000, // Dữ liệu sẽ lưu trong cache trong 10 phút
    refetchOnWindowFocus: false, // Không tự động refetch khi người dùng quay lại trang
  });

  // Cập nhật trạng thái dữ liệu sau khi refetch
  useEffect(() => {
    if (fetchedData) {
      setData(fetchedData.items);
      setMeta(fetchedData.meta);
    }
  }, [fetchedData]);

  // Hàm để trigger refetch từ bên ngoài
  const refreshData = useCallback(() => {
    refetch(); // Gọi refetch khi cần làm mới dữ liệu
  }, [refetch]);

  return {
    data,
    loading: isLoading,
    error: isError ? new Error('Failed to fetch data') : null,
    meta,
    refreshData, // Trả về hàm refreshData để có thể gọi bên ngoài
  };
};
