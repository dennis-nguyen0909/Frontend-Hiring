import moment from "moment";

/* eslint-disable @typescript-eslint/no-unused-vars */
export const isJsonString = (data: any) => {
  try {
    JSON.parse(data);
  } catch (error) {
    return false;
  }
  return true;
};

export function convertHtmlToText(html: any) {
  // Create a temporary DOM element to parse HTML
  const tempElement = document.createElement("div");
  tempElement.innerHTML = html;

  // Use textContent to get the plain text
  return tempElement.textContent || tempElement.innerText || "";
}

export const defaultMeta = {
  count: 0,
  current_page: 1,
  per_page: 10,
  total: 0,
  total_pages: 0,
};

export const calculateTimeRemaining = (expireDate:string) => {
  const now = moment(); // Lấy thời gian hiện tại
  const expirationDate = moment(expireDate); // Ngày hết hạn sử dụng moment

  const diffDuration = moment.duration(expirationDate.diff(now)); // Tính toán thời gian chênh lệch

  if (diffDuration.asMilliseconds() <= 0) {
    return "Hết hạn"; // Nếu đã quá hạn
  }

  const days = Math.floor(diffDuration.asDays()); // Số ngày
  const hours = Math.floor(diffDuration.asHours() % 24); // Số giờ
  const minutes = Math.floor(diffDuration.asMinutes() % 60); // Số phút

  return `${days} ngày ${hours} giờ ${minutes} phút`;
};
