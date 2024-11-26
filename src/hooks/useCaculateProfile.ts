import { useQuery } from "@tanstack/react-query";
import { USER_API } from "../services/modules/userServices";

const useCalculateUserProfile = (userId: string, accessToken: string) => {
  console.log('userId',userId)
  console.log('userId',accessToken)
  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["calculateUserProfile", userId], // unique key cho query này
    queryFn: async () => {
      const res = await USER_API.calculateProfileCompletion(userId, accessToken);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // Dữ liệu cache sẽ stale sau 5 phút
    cacheTime: 10 * 60 * 1000, // Dữ liệu sẽ lưu trong cache trong 10 phút
    refetchOnWindowFocus: false, // Không tự động refetch khi người dùng quay lại trang
  });

  return { data, refetch, isLoading, isError };
};

export default useCalculateUserProfile;
