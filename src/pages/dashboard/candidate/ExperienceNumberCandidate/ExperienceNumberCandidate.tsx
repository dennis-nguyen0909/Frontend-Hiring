import { Checkbox, Form, InputNumber, notification, Button, Row, Col } from "antd";
import * as userServices from "../../../../services/modules/userServices";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import useCalculateUserProfile from "../../../../hooks/useCaculateProfile";

const ExperienceNumberCandidate = () => {
  const [form] = Form.useForm(); // Đảm bảo khai báo form đúng cách
  const userDetail = useSelector((state) => state.user);
  const { handleUpdateProfile } = useCalculateUserProfile(userDetail?._id, userDetail?.access_token);

  const onFinish = async (values: any) => {
    const params = {
      ...values,
      id: userDetail?._id,
    };
    const res = await userServices.updateUser(params);
    if (res.data) {
      notification.success({
        message: "Thông báo",
        description: "Cập nhật thông tin năm kinh nghiệm",
      });
      await handleUpdateProfile();
    } else {
      notification.error({
        message: "Thông báo",
        description: "Cập nhật thất bại",
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

  return (
    <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Số năm kinh nghiệm</h1>
      
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        style={{ maxWidth: '600px', margin: '0 auto' }} // Căn giữa form
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Số tháng kinh nghiệm"
              name="total_experience_months"
              rules={[
                {
                  required: !form.getFieldValue("no_experience"),
                  message: "Vui lòng nhập số tháng kinh nghiệm",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={1000}
                placeholder="Nhập số tháng"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              label="Số năm kinh nghiệm"
              name="total_experience_years"
              rules={[
                {
                  required: form.getFieldValue("total_experience_months") === undefined,
                  message: "Vui lòng nhập số năm kinh nghiệm",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={100}
                placeholder="Nhập số năm"
                style={{ width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          name="no_experience"
          valuePropName="checked"
        >
          <Checkbox>Không có kinh nghiệm</Checkbox>
        </Form.Item>

        <Form.Item style={{ textAlign: 'center' }}>
        <Button htmlType="submit"  className="px-4 !bg-[#201527] !text-primaryColor !border-none !hover:text-white">
                    Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ExperienceNumberCandidate;
