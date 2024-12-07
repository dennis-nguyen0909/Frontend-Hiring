import { Button, Form, Input, Select } from "antd";
import { MailIcon } from "lucide-react";
import { useCities } from "../../../hooks/useCities";
import { useDistricts } from "../../../hooks/useDistricts";
import { useWards } from "../../../hooks/useWards";
import { useState } from "react";
import { useForm } from "antd/es/form/Form";
import { useSelector } from "react-redux";
import { USER_API } from "../../../services/modules/userServices";

const Contact = ({ handleTabChange }) => {
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const { cities, loading: citiesLoading } = useCities();
  const { districts, loading: districtLoading } = useDistricts(city);
  const { wards, loading: wardsLoading } = useWards(district);
const userDetail=useSelector(state=>state.user)
  const handleCityChange = (value) => {
    setCity(value);
  };

  const handleDistrictChange = (value) => {
    setDistrict(value);
  };

  const handleWardChange = (value) => {
    setWard(value);
  };
  const [form]=useForm()

  const onFinish =async(values:any)=>{
    const params = {
      id:userDetail?._id,
      city_id:values.city,
      district_id:values.district,
      ward_id:values.ward,
      phone:values.phone
    }
    const res = await USER_API.updateUser(params);
    if(res.data){
      handleTabChange("completed")
    }
  }
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <Form onFinish={onFinish}  form={form} initialValues={{
          email:userDetail?.email
      }}layout="vertical">
        <div className="space-y-6">
          <div>
            <Form.Item
              name="email"
              label="Email"
            >
              <Input
                type="email"
                disabled
                placeholder="Email address"
                prefix={<MailIcon className="h-4 w-4 text-gray-400" />}
                className="w-full"
              />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              name="phone"
              label="Phone"
              rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}

            >
              <Input
                placeholder="Phone..."
                className="w-full"
              />
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Field */}
            <Form.Item
              label="Thành phố"
              name="city"
              rules={[{ required: true, message: "Vui lòng chọn thành phố" }]}
            >
              <Select
                placeholder="Chọn Thành Phố"
                value={city}
                onChange={handleCityChange}
                loading={citiesLoading}
              >
                {cities.map((cityItem) => (
                  <Select.Option key={cityItem._id} value={cityItem._id}>
                    {cityItem.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* District Field */}
            <Form.Item
              label="Quận/Huyện"
              name="district"
              rules={[{ required: true, message: "Vui lòng chọn quận huyện" }]}
            >
              <Select
                placeholder="Chọn Quận/Huyện"
                value={district}
                onChange={handleDistrictChange}
                loading={districtLoading}
              >
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
              label="Xã"
              name="ward"
              rules={[{ required: true, message: "Vui lòng chọn xã" }]}
            >
              <Select
                placeholder="Chọn xã..."
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
            <Form.Item label="Địa chỉ" name="address">
              <Input placeholder="Vui lòng nhập địa chỉ" />
            </Form.Item>
          </div>
        </div>

        <div className="mt-8 flex justify-between">
        <Button htmlType="submit"  className="px-4 !bg-[#201527] !text-primaryColor !border-none !hover:text-white">
          Save & Next
        </Button>
        </div>
      </Form>
    </div>
  );
};

export default Contact;
