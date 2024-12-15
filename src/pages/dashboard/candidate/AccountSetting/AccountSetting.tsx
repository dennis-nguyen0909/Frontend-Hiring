import { Form, Input, Select, Button, Checkbox, Space, Switch, notification, message } from 'antd';
import { PhoneOutlined, EnvironmentOutlined, MailOutlined, FileTextOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useCities } from '../../../../hooks/useCities';
import { useDistricts } from '../../../../hooks/useDistricts';
import { useWards } from '../../../../hooks/useWards';
import { USER_API } from '../../../../services/modules/userServices';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../../../redux/slices/userSlices';
import { useNavigate } from 'react-router-dom';

const ContactForm = () => {
    const userDetail = useSelector(state=>state.user)
    const [city, setCity] = useState( userDetail?.city_id?._id || "");
    const dispatch =useDispatch()
    const [district, setDistrict] = useState( userDetail?.district_id?._id ||"");
    const [ward, setWard] = useState(userDetail?.ward_id?._id||"");
    const { cities, loading: citiesLoading } = useCities();
    const { districts, loading: districtLoading } = useDistricts(city);
    const { wards, loading: wardsLoading } = useWards(district);
    const navigate = useNavigate();
    const handleCityChange = (value) => {
        setCity(value);
      };
      const handleDistrictChange = (value) => {
        setDistrict(value);
      };
    
      const handleWardChange = (value) => {
        setWard(value);
      };
  const handleSaveChanges = async(values:any) => {
    const params={
        phone:values.phone,
        id:userDetail?.id,
        district_id:district,
        city_id:city,
        ward_id:ward,
        address:values.address
    }
    try {
        const res = await USER_API.updateUser(params,userDetail?.access_token);
            if(res.data){
                message.success('Cập nhật thành công');
                dispatch(updateUser({...res.data}))
            }
    } catch (error) {
        console.error("error",error)
        notification.error({
            message:'Thông báo',
            description:error.response.message.data
        })
    }
    // Handle save logic here
  };
  const [form ]=Form.useForm()
  const handleSavePassword = async()=>{
    const values = form.getFieldsValue();
    try {
        const params={
            user_id:userDetail?.id,
            ...values
        }
        const res = await USER_API.resetPassword(params,userDetail?.id)
    } catch (error) {
        console.error(error)
    }
  }
  return (
    <Form
    layout="vertical"
    form={form}
    onFinish={handleSaveChanges}
    initialValues={{
        email: userDetail?.email,
        phone:userDetail?.phone,
        role:userDetail?.role?.role_name,
        city:userDetail?.city_id?.name,
        district:userDetail?.district_id?.name,
        ward:userDetail?.ward_id?.name,
        address:userDetail?.address,
        location:userDetail?.city_id?.name +' , '+ userDetail?.district_id?.name +' , '+userDetail?.ward_id?.name

        // location:
    }}
>
    {/* Contact Info */}
    <div className="space-y-8">
        <div>
            <h2 className="text-xl font-semibold mb-4">Contact Info</h2>
            <div className="space-y-4">
                {/* <Form.Item
                    label="Map Location"
                    name="location"
                    rules={[{ required: true, message: 'Please input your location!' }]}
                >
                    <Input prefix={<EnvironmentOutlined />} placeholder="Enter your location" />
                </Form.Item> */}
                 <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your email!' }]}
                >
                    <Input disabled prefix={<MailOutlined />} placeholder="Email address" />
                </Form.Item>
                <Form.Item
                    label="Phone"
                    name="phone"
                    // rules={[{ required: true, message: 'Please input your phone number!' }]}
                >
                    <Input style={{ width: '80%' }} placeholder="Phone number" prefix={<PhoneOutlined />} />
                </Form.Item>

<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please select a city" }]}
            >
              <Select
                placeholder="Select City"
                value={city}
                onChange={handleCityChange}
                loading={citiesLoading}
              >
                {/* Render city options dynamically from the hook */}
                {cities.map((cityItem) => (
                  <Select.Option key={cityItem._id} value={cityItem._id}>
                    {cityItem.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* District Field */}
            <Form.Item
              label="District"
              name="district"
              rules={[{ required: true, message: "Please select a district" }]}
            >
              <Select
                placeholder="Select District"
                value={district}
                onChange={handleDistrictChange}
                loading={districtLoading}
              >
                {/* Render city options dynamically from the hook */}
                {districts.map((district) => (
                  <Select.Option key={district._id} value={district._id}>
                    {district.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ward Field */}
            <Form.Item
              label="Ward"
              name="ward"
              rules={[{ required: true, message: "Please select a ward" }]}
            >
              <Select
                placeholder="Select Ward"
                value={ward}
                onChange={handleWardChange}
                loading={wardsLoading}
              >
                {wards.map((ward) => (
                  <Select.Option key={ward._id} value={ward._id}>
                    {ward.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Address Field */}
            <Form.Item label="Address" name="address">
              <Input placeholder="Enter full address" />
            </Form.Item>
          </div>

            </div>
        </div>
        <Form.Item>
            <Button type="primary" htmlType="submit" className="mt-4 bg-blue-500 hover:bg-blue-600">
                Save Changes
            </Button>
        </Form.Item>
        {/* Notifications */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Notification</h2>
            <div className="space-y-2">
                <Form.Item name="notifyShortlisted" valuePropName="checked" noStyle>
                    <Checkbox>Notify me when employers shortlisted me</Checkbox>
                </Form.Item>
                <Form.Item name="notifyJobExpired" valuePropName="checked" noStyle>
                    <Checkbox>Notify me when my applied jobs expire</Checkbox>
                </Form.Item>
                <Form.Item name="notifyJobAlert" valuePropName="checked" noStyle>
                    <Checkbox>Notify me when I have up to 5 job alerts</Checkbox>
                </Form.Item>
                <Form.Item name="notifyProfileSaved" valuePropName="checked" noStyle>
                    <Checkbox>Notify me when employers saved my profile</Checkbox>
                </Form.Item>
                <Form.Item name="notifyRejected" valuePropName="checked" noStyle>
                    <Checkbox>Notify me when employers rejected me</Checkbox>
                </Form.Item>
            </div>
        </div>

        {/* Job Alerts */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Job Alerts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* <Form.Item
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please input your job role!' }]}
                >
                    <Input prefix={<FileTextOutlined />} placeholder="Your job roles" />
                </Form.Item> */}
                <Form.Item
                    label="Location"
                    name="location"
                    // rules={[{ required: true, message: 'Please input the location!' }]}
                >
                    <Input disabled prefix={<EnvironmentOutlined />} placeholder="City, state, country name" />
                </Form.Item>
            </div>
        </div>

        {/* Profile Privacy */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <h2 className="text-xl font-semibold mb-4">Profile Privacy</h2>
                <Form.Item name="profilePrivacy" valuePropName="checked" noStyle>
                    <Space>
                        <Switch defaultChecked />
                        <span>Your profile is public now</span>
                    </Space>
                </Form.Item>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-4">Resume Privacy</h2>
                <Form.Item name="resumePrivacy" valuePropName="checked" noStyle>
                    <Space>
                        <Switch />
                        <span>Your resume is private now</span>
                    </Space>
                </Form.Item>
            </div>
        </div>

        {/* Change Password */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Form.Item
                    label="Current Password"
                    name="current_password"
                    // rules={[{ required: true, message: 'Please input your current password!' }]}
                >
                    <Input.Password placeholder="Current Password" />
                </Form.Item>
                <Form.Item
                    label="New Password"
                    name="new_password"
                    // rules={[{ required: true, message: 'Please input your new password!' }]}
                >
                    <Input.Password placeholder="New Password" />
                </Form.Item>
                <Form.Item
                    label="Confirm Password"
                    name="confirm_password"
                    // rules={[{ required: true, message: 'Please confirm your new password!' }]}
                >
                    <Input.Password placeholder="Confirm Password" />
                </Form.Item>
            </div>
            <Button onClick={handleSavePassword}>Lưu mật khẩu</Button>
        </div>

        {/* Delete Account */}
        <div>
            <h2 className="text-xl font-semibold mb-4">Delete Your Account</h2>
            <p className="text-gray-600 mb-4">
                If you delete your Jobpilot account, you will no longer be able to get information about the matched jobs, following employers, job alerts, shortlisted jobs, and other activities. Your account will be deactivated from all the services of Jobpilot.com.
            </p>
            <Button danger htmlType="button">
                Close Account
            </Button>
        </div>
    </div>
</Form>
  );
};

export default ContactForm;
