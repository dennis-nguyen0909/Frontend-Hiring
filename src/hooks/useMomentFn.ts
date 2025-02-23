import moment from 'moment';
import { useSelector } from 'react-redux';

const useMomentFn = () => {
  // Lấy thông tin người dùng từ Redux
  const userDetail = useSelector((state) => state.user);

  // Lấy định dạng ngày từ Redux hoặc mặc định "DD/MM/YYYY"
  const dateFormat = userDetail?.dateFormat || "DD/MM/YYYY";

  // Hàm format ngày
  const formatDate = (date: Date | string) => moment(date).format(dateFormat);

  return { formatDate, dateFormat };
};

export default useMomentFn;
