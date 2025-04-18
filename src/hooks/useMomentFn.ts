import dayjs from "dayjs";
import moment from "moment";
import { useSelector } from "react-redux";

const useMomentFn = () => {
  // Lấy thông tin người dùng từ Redux
  const userDetail = useSelector((state) => state.user);

  // Lấy định dạng ngày từ Redux hoặc mặc định "DD/MM/YYYY"
  const dateFormat = userDetail?.dateFormat || "DD/MM/YYYY";
  const formatDate = (
    date: string | Date | dayjs.Dayjs | null,
    format = dateFormat
  ) => {
    return date ? dayjs(date).format(format) : "";
  };

  return { formatDate, dateFormat };
};

export default useMomentFn;
