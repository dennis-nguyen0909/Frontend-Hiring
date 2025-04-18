const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response) {
    return {
      success: false,
      status: error.response.status,
      message: error.response.data.message || defaultMessage,
      errors: error.response.data.errors || error.response.data,
    };
  } else {
    return {
      success: false,
      message: "Lỗi kết nối đến server. Vui lòng thử lại sau.",
      errors: error.message,
    };
  }
};

export default handleApiError;
