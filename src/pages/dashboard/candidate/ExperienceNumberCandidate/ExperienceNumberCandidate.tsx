import { Checkbox, Form, Input, InputNumber, notification } from "antd";
import * as userServices from '../../../../services/modules/userServices';
import { useSelector } from "react-redux";
import { useEffect } from "react";
const ExperienceNumberCandidate = (
  {refetch}
) => {
  const [form] = Form.useForm();  // Đảm bảo khai báo form đúng cách
  const userDetail = useSelector(state=>state.user)

  const onFinish = async(values: any) => {
    const params={
        ...values,
        id:userDetail._id
    }
    const res  = await userServices.updateUser(params);
    if(res.data){
        notification.success({
            message: "Notification",
            description: "Cập nhật thống tin năm kinh nghiệm",
        })
    }else{
        notification.error({
            message: "Notification",
            description: "Cập nhật thất bại",
        })
    }
  };

  useEffect(()=>{
    form.setFieldsValue({
        no_experience:userDetail.no_experience,
        total_experience_months:userDetail.total_experience_months,
        total_experience_years:userDetail.total_experience_years
    })
  },[])

  return (
    <Form form={form} onFinish={onFinish}>
      <h1>Số năm kinh nghiệm</h1>
      
      <Form.Item
        label="Không có kinh nghiệm"
        name="no_experience"
        valuePropName="checked"
      >
        <Checkbox>Không có kinh nghiệm</Checkbox>
      </Form.Item>

      <Form.Item
        label="Số tháng kinh nghiệm"
        name="total_experience_months"
        rules={[
          {
            required: !form.getFieldValue('no_experience'),
            message: 'Vui lòng nhập số tháng kinh nghiệm',
          },
        ]}
      >
        <InputNumber 
          min={0} 
          max={1000} 
          placeholder="Nhập số tháng kinh nghiệm" 
          style={{ width: '100%' }} 
        />
      </Form.Item>

      <Form.Item
        label="Số năm kinh nghiệm"
        name="total_experience_years"
        rules={[
          {
            required: form.getFieldValue('total_experience_months') === undefined,
            message: 'Vui lòng nhập số năm kinh nghiệm',
          },
        ]}
      >
        <InputNumber
          min={0}
          max={100}
          placeholder="Nhập số năm kinh nghiệm"
          style={{ width: '100%' }}
        />
      </Form.Item>

      <button type="submit">Submit</button>
    </Form>
  );
};

export default ExperienceNumberCandidate;
