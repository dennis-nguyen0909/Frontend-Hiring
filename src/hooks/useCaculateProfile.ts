import { useQuery } from "@tanstack/react-query";
import { USER_API } from "../services/modules/userServices";

const useCalculateUserProfile = (userId: string | undefined, accessToken: string | undefined) => {
  const { data, refetch, isLoading, isError } = useQuery({
    queryKey: ["calculateUserProfile", userId], 
    queryFn: async () => {
      if (!userId || !accessToken) {
        throw new Error("Missing userId hoặc accessToken");
      }
      const res = await USER_API.calculateProfileCompletion(userId, accessToken);
      return res.data;
    },
    staleTime: 5 * 60 * 1000, // Dữ liệu cache sẽ stale sau 5 phút
    cacheTime: 10 * 60 * 1000, // Dữ liệu sẽ lưu trong cache trong 10 phút
    refetchOnWindowFocus: false, // Không tự động refetch khi người dùng quay lại trang
    enabled: !!userId && !!accessToken, // Chỉ kích hoạt useQuery nếu userId và accessToken có giá trị
  });
  
  // Giả sử khi cập nhật profile của người dùng, bạn muốn làm mới lại dữ liệu
  const handleUpdateProfile = async () => {
    // Sau khi cập nhật profile xong, gọi refetch để làm mới dữ liệu
    await refetch();
  };

  return { data, refetch, isLoading, isError, handleUpdateProfile };
};

export default useCalculateUserProfile;
