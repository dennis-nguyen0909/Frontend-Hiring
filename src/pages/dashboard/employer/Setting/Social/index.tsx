import { CloseOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Input, notification, Select } from "antd";
import { useEffect, useState } from "react";
import { SOCIAL_LINK_API } from "../../../../../services/modules/SocialLinkService";
import { useSelector } from "react-redux";
import LoadingComponentSkeleton from "../../../../../components/Loading/LoadingComponentSkeleton";

const SocialEmployer = () => {
  const userDetail = useSelector((state) => state.user);
  const [loading,setLoading]=useState<boolean>(true)
  const [socialLinks, setSocialLinks] = useState([
  ]);
const handleSocialLinkChange = (index, field, value) => {
  const updatedLinks = [...socialLinks];
  updatedLinks[index][field] = value;

  if (updatedLinks[index].isExisting) {
    updatedLinks[index].hasChanged = true;
  } else {
    updatedLinks[index].hasChanged = true;
    updatedLinks[index].isExisting = false; 
  }

  setSocialLinks(updatedLinks);
};


  // Thêm một link mới
  const addNewSocialLink = () => {
    setSocialLinks([...socialLinks, { type: "", url: "" }]);
  };



  // Lấy các social links hiện tại từ server
  const handleGetSocialLinks = async (current = 1, pageSize = 10) => {
    try {
      setLoading(true);
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await SOCIAL_LINK_API.getAll(params, userDetail?.access_token);
      if (res.data) {
        // Đánh dấu các link lấy về từ server là "đã tồn tại"
        const existingLinks = res.data.items.map((link) => ({
          ...link,
          isExisting: true, // Đánh dấu là đã tồn tại
          hasChanged: false, // Ban đầu chưa có thay đổi
        }));
        setSocialLinks([...existingLinks]);
      }
    } catch (error) {
      console.error(error);
    }finally{
      setLoading(false)
    }
  };

  // Gọi hàm lấy dữ liệu ban đầu
  useEffect(() => {
    handleGetSocialLinks();
  }, []);

  // Hàm lưu thay đổi
  const handleSaveChanges = async () => {
    if (socialLinks.length <= 0) {
      notification.error({
        message: "Thông báo",
        description: "Vui lòng chọn link",
      });
      return;
    }
    try {
      const requests = socialLinks
        .filter((social) => social.hasChanged || !social.isExisting)
        .map((social) => {
          const params = {
            user_id: userDetail?._id,
            type: social?.type,
            url: social?.url,
          };
          return SOCIAL_LINK_API.create(params, userDetail?.access_token); // Gọi API tạo mới hoặc cập nhật
        });
      // Nếu có yêu cầu nào cần thực hiện
      if (requests.length > 0) {
        const results = await Promise.all(requests);

        // Kiểm tra kết quả của tất cả các lần gọi API
        if (results.every((res) => res.data)) {
          notification.success({
            message: "Thông báo",
            description: "Lưu thay đổi thành công!",
          });
        }
      } else {
        notification.info({
          message: "Thông báo",
          description: "Không có thay đổi nào để lưu.",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra, vui lòng thử lại.",
      });
    }
  };
const onDeleted = async(id)=>{
  const res = await SOCIAL_LINK_API.deleteMany([id],userDetail?.access_token);
  if(+res.statusCode === 200){
    notification.success({
      message:"Thông báo",
      description:"Xóa thành công"
    })
    handleGetSocialLinks()
  }
}
  return (
    <LoadingComponentSkeleton isLoading={loading}>
      <h2 className="text-xl font-semibold mb-4">Liên kết xã hội</h2>
      {socialLinks.map((link, index) => (
        <div key={index} className="mb-4">
          <label className="block text-[12px] font-medium text-gray-700 mb-1">
            Liên kết {index + 1}
          </label>
          <div className="flex lg:items-center items-start space-x-2 flex-col md:flex-row">
            <Select
            className="ml-2 text-[12px]"
              style={{ width: "150px" }}
              value={link.type}
              onChange={(value) =>
                handleSocialLinkChange(index, "type", value)
              }
            >
              <Select.Option value="Facebook"><span className="text-[12px]">Facebook</span></Select.Option>
              <Select.Option value="Twitter"><span className="text-[12px]">Twitter</span></Select.Option>
              <Select.Option value="Instagram"><span className="text-[12px]">Instagram</span></Select.Option>
              <Select.Option value="Youtube"><span className="text-[12px]">Youtube</span></Select.Option>
              <Select.Option value="LinkedIn"><span className="text-[12px]">LinkedIn</span></Select.Option>
            </Select>
           <div className="md:flex-row flex w-full justify-start flex-row mt-2 md:mt-0">
           <Input
              placeholder="Profile link/url..."
              className="text-[12px]"
              value={link.url}
              onChange={(e) =>
                handleSocialLinkChange(index, "url", e.target.value)
              }
              style={{ flex: 1 }}
            />
            <Button
              type="text"
              className="!text-[12px]"
              icon={<CloseOutlined />}
              onClick={() => onDeleted(link?._id)}
            />
           </div>
          </div>
        </div>
      ))}
      <Button
        type="dashed"
        onClick={addNewSocialLink}
        className="w-full mt-4 !text-[12px]"
        icon={<PlusOutlined />}
      >
        
Thêm liên kết xã hội mới
      </Button>
      <Button htmlType="submit" onClick={handleSaveChanges}  className="px-4 !bg-primaryColor !text-white !border-none !hover:text-white mt-5">
          Lưu thay đổi
        </Button>
    </LoadingComponentSkeleton>
  );
};

export default SocialEmployer;
