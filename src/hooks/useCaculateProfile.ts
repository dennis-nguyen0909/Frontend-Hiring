import { useQuery } from "@tanstack/react-query";
import { USER_API } from "../services/modules/userServices";

const useCalculateUserProfile = (userId: string, accessToken: string) => {
  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["calculateUserProfile", userId], 
    queryFn: async () => {
      const res = await USER_API.calculateProfileCompletion(userId, accessToken);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // Dữ liệu cache sẽ stale sau 5 phút
    cacheTime: 10 * 60 * 1000, // Dữ liệu sẽ lưu trong cache trong 10 phút
    refetchOnWindowFocus: false, // Không tự động refetch khi người dùng quay lại trang
  });
  
  // Giả sử khi cập nhật profile của người dùng, bạn muốn làm mới lại dữ liệu
  const handleUpdateProfile = async () => {
    // Sau khi cập nhật profile xong, gọi refetch để làm mới dữ liệu
    await refetch();
  };

  return { data, refetch, isLoading, isError, handleUpdateProfile };
};

export default useCalculateUserProfile;
