import { Avatar, Button, Modal, Form, Select, notification } from "antd";
import { Edit, Star } from "lucide-react";
import avatarDefault from "../../../assets/avatars/avatar-default.jpg";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CV_API } from "../../../services/modules/CvServices";
import { Meta } from "../../../types";
import { USER_API } from "../../../services/modules/userServices";
import useMomentFn from "../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";

interface CV {
  _id: string;
  user_id: string;
  createdAt: string;
  cv_link: string;
  cv_name: string;
  public_id: string;
  updatedAt: string;
}

export default function ProfileCard({ userDetail }: any) {
  const { t } = useTranslation();
  const [listCv, setListCv] = useState<CV[]>([]);
  const [meta, setMeta] = useState<Meta>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { formatDate } = useMomentFn();
  const [selectedCV, setSelectedCV] = useState<string | null>(
    userDetail.primary_cv_id || null
  );
  const navigate = useNavigate();

  const handleGetCvByUserId = async (current = 1, pageSize = 10) => {
    try {
      const params = {
        current,
        pageSize,
        query: {
          user_id: userDetail?._id,
        },
      };
      const res = await CV_API.getAll(params, userDetail?.access_token);
      if (res.data) {
        setListCv([...res.data.items]);
        setMeta(res.data.meta);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    handleGetCvByUserId();
  }, []);

  const handleSetCVMain = async () => {
    if (selectedCV) {
      const params = {
        primary_cv_id: selectedCV,
        id: userDetail?._id,
      };
      const updateCVMain = await USER_API.updateUser(
        params,
        userDetail?.access_token
      );
      if (updateCVMain.data) {
        notification.success({
          message: t("notification"),
          description: t("update_success"),
        });
      }
      setIsModalVisible(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[14px] font-bold">{t("hiredev_profile")}</h2>
        <span className="text-gray-500 text-[12px]">
          {t("last_updated")} {formatDate(userDetail?.updatedAt)}
        </span>
      </div>

      <div className="rounded-lg overflow-hidden bg-white border">
        {/* Banner */}
        <div className="h-48 bg-gradient-to-r  to-green-400 relative">
          <div className="absolute inset-0 opacity-30">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url(${userDetail?.background})`,
                backgroundSize: "cover",
              }}
            />
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="relative -mt-16 mb-4">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-100">
              <Avatar
                src={userDetail?.avatar || avatarDefault}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <h1 className="text-2xl font-bold mb-4">{userDetail?.full_name}</h1>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-6">
            <Button
              onClick={() => {
                navigate(`/profile/${userDetail?._id}`);
              }}
              icon={<Edit className="w-4 h-4" />}
              className="flex items-center gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 !text-[12px]"
            >
              {t("edit")}
            </Button>
            <Button
              icon={<Star className="w-4 h-4" />}
              className="flex items-center gap-2 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 !text-[12px]"
              onClick={() => setIsModalVisible(true)}
            >
              {t("set_as_primary_cv")}
            </Button>
          </div>

          {/* Mô tả */}
          <p className="text-gray-600 mb-2 text-[12px]">
            {t("hiredev_profile_description")}
          </p>
          <a
            href="#"
            className="text-green-600 hover:text-green-700 font-medium !text-[12px]"
          >
            {t("learn_now")}
          </a>
        </div>
      </div>

      {/* Modal để chọn CV chính */}
      <Modal
        title={t("set_as_primary_cv")}
        visible={isModalVisible}
        onOk={handleSetCVMain}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form>
          <Form.Item label={t("select_a_cv")}>
            <Select
              value={selectedCV}
              onChange={(value) => setSelectedCV(value)}
              placeholder={t("select_a_cv")}
            >
              {listCv?.map((cv) => (
                <Select.Option key={cv._id} value={cv._id}>
                  {cv.cv_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
