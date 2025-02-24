import {
  Checkbox,
  Form,
  InputNumber,
  notification,
  Button,
  Row,
  Col,
} from "antd";
import * as userServices from "../../../../services/modules/userServices";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import useCalculateUserProfile from "../../../../hooks/useCaculateProfile";
import { useTranslation } from "react-i18next";
const ExperienceNumberCandidate = () => {
  const [form] = Form.useForm();
  const userDetail = useSelector((state) => state.user);
  const { handleUpdateProfile } = useCalculateUserProfile(
    userDetail?._id,
    userDetail?.access_token
  );
  const { t } = useTranslation();
  const [noExperience, setNoExperience] = useState(
    userDetail?.no_experience || false
  );

  const onFinish = async (values: any) => {
    const params = {
      ...values,
      id: userDetail?._id,
    };
    const res = await userServices.updateUser(params);
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("update_experience_number"),
      });
      await handleUpdateProfile();
    } else {
      notification.error({
        message: t("notification"),
        description: t("update_experience_number_failed"),
      });
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      no_experience: userDetail.no_experience,
      total_experience_months: userDetail.total_experience_months,
      total_experience_years: userDetail.total_experience_years,
    });
  }, []);

  // Cập nhật trạng thái "Không có kinh nghiệm"
  const handleCheckboxChange = (e: any) => {
    setNoExperience(e.target.checked);
    form.setFieldsValue({
      total_experience_months: undefined,
      total_experience_years: undefined,
    });
  };

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h1
        className="text-[12px]"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        {t("experience_number")}
      </h1>

      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: "600px", margin: "0 auto" }} // Căn giữa form
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label={
                <div className="text-[12px]">
                  {t("total_experience_months")}
                </div>
              }
              name="total_experience_months"
              rules={[
                {
                  required: !noExperience, // Yêu cầu nếu không có kinh nghiệm
                  message: t("please_enter_experience_number"),
                },
              ]}
            >
              <InputNumber
                min={0}
                max={1000}
                placeholder={t("enter_experience_number")}
                style={{ width: "100%" }}
                className="text-[12px]"
                disabled={noExperience} // Disable nếu không có kinh nghiệm
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label={
                <div className="text-[12px]">{t("total_experience_years")}</div>
              }
              name="total_experience_years"
              rules={[
                {
                  required:
                    !noExperience &&
                    form.getFieldValue("total_experience_months") === undefined,
                  message: t("please_enter_experience_number"),
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder={t("enter_experience_number")}
                style={{ width: "100%" }}
                className="text-[12px]"
                disabled={noExperience} // Disable nếu không có kinh nghiệm
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="no_experience" valuePropName="checked">
          <Checkbox className="text-[12px]" onChange={handleCheckboxChange}>
            {t("no_experience")}
          </Checkbox>
        </Form.Item>
        <Form.Item style={{ textAlign: "center" }}>
          <Button
            htmlType="submit"
            className="px-4 !bg-primaryColor !text-[12px] !text-white"
          >
            {t("update_experience_number")}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExperienceNumberCandidate;
