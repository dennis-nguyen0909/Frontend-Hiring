import {
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  HeartFilled,
  HeartOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Dropdown,
  Image,
  Menu,
  MenuProps,
  notification,
  Typography,
} from "antd";
import moment from "moment";
import avatarDefault from "../../../../assets/avatars/avatar-default.jpg";
import { API_APPLICATION } from "../../../../services/modules/ApplicationServices";
import { useSelector } from "react-redux";

const { Text } = Typography;
interface IPropsApplicationCard {
  applied: any;
  handleFetchData: () => void;
  className?: any;
  handleOpenModalEmail:()=>void;
}

const ApplicationCard = ({
  applied,
  handleFetchData,
  className,
  handleOpenModalEmail
}: IPropsApplicationCard) => {
  const { user_id, applied_date, job_id,save_candidates } = applied;
    const userDetail = useSelector(state=>state.user)
  const items: MenuProps["items"] = [
    {
      key: "rejected",
      label: "Từ chối",
      onClick: () => handleMenuClick("rejected", applied._id),
    },
    {
      key: "accepted",
      label: "Chấp nhận",
      onClick: () => handleMenuClick("accepted", applied._id),
    },
    {
      key: "pending",
      label: "Đang chờ",
      onClick: () => handleMenuClick("pending", applied._id),
    },
  ];

  const itemsDelete: MenuProps["items"] = [
    {
      key: "delete",
      label: "Xóa",
      onClick: () => handleMenuClick("delete", applied._id),
    },
  ];
  const handleDelete = () => {};
  const handleMenuClick = async (action: string, id: string) => {
    try {
      if (action === "delete") {
        const res = await API_APPLICATION.deleteManyApplication(
          [id],
          user_id?.access_token
        );
        if (res.data) {
          handleFetchData();
        }
      } else {
        const res = await API_APPLICATION.updateApplication(
          id,
          { status: action },
          user_id?.access_token
        );
        if (res.data) {
          handleFetchData();
        }
      }
    } catch (error) {
      notification.error({
        message: "Notification",
        description: error.message,
      });
    }
  };

  const handleSaveCandidate = async (userId: string) => {
    try {
    const res = await API_APPLICATION.saveCandidate(applied?._id, userId, user_id?.access_token,userDetail?.access_token);
      if (res.data) {
        handleFetchData();
      }
    } catch (error) {
        notification.error({
          message: "Notification",
          description: error.message,
        })
    }
  };
  
  const onDownloadCvCandidate = ()=>{
    const{primary_cv_id}=user_id
    const cvLink =applied?.cv_id?.cv_link
    const cvName =applied?.cv_id?.cv_name
    console.log("user_id",user_id)
    const link = document.createElement("a");
    if(cvLink==="" || !cvLink){
      notification.error({
        message:'Thông báo',
        description:'Ứng viên chưa cập nhật CV'
      })
    }
    link.href = cvLink || primary_cv_id.cv_link;
    link.download = cvName||  primary_cv_id.cv_name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const isSaved = save_candidates && save_candidates.includes(user_id?._id);
  return (
    <Card className={`mb-4 ${className}`}>
      <div className="flex items-start">
        <Image
          src={user_id?.avatar || avatarDefault}
          width={48}
          height={48}
          className="rounded-full mr-3"
        />
        <div className="flex-grow ml-3 flex flex-col">
          <Text className="font-bold text-[18px]">{user_id?.full_name}</Text>
          <Text type="secondary" className="text-sm">
            {job_id?.title}
          </Text>
        </div>
        <div className="flex space-x-2">
          <Dropdown overlay={<Menu items={items} />} placement="top">
            <Button icon={<EditOutlined />} size="small" type="default" />
          </Dropdown>

          <Dropdown overlay={<Menu items={itemsDelete} />} placement="top">
            <Button
              icon={<DeleteOutlined />}
              onClick={handleDelete}
              size="small"
              type="default"
              danger
            />
          </Dropdown>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm">
        {user_id?.total_experience_months && user_id?.total_experience_years ? (
          <p>
            Kinh nghiệm:{" "}
            {user_id?.total_experience_months +
              " tháng " +
              user_id?.total_experience_years +
              " năm"}
          </p>
        ) : (
          <p>Kinh nghiệm: Chưa có kinh nghiệm</p>
        )}
        {user_id?.education_ids?.map((edu, index) => (
          <p key={index}>Education: {edu.school}</p>
        ))}
        <div className="flex justify-between items-center">
          <p>Ngày nộp: {moment(applied_date).format("MM/DD/YYYY")}</p>
          <div
            className="cursor-pointer text-xl text-red-500"
            onClick={() => handleSaveCandidate(user_id?._id)}
          >
              {isSaved ? <HeartFilled/> : <HeartOutlined />}
          </div>
        </div>
      </div>
      <Button onClick={onDownloadCvCandidate} icon={<DownloadOutlined />} className="w-full mt-4 !border-black !text-black !hover:text-primaryColor">
        Download CV
      </Button>
      {applied.status === 'accepted' && <Button onClick={()=>handleOpenModalEmail(applied)}>Gửi email</Button>}
    </Card>
  );
};

export default ApplicationCard;
