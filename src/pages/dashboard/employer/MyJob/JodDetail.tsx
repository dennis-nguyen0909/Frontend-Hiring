import {
  Form,
  Input,
  Select,
  InputNumber,
  Checkbox,
  Radio,
  Button,
  Tag,
  notification,
} from "antd";
import { Editor } from "@tinymce/tinymce-react";
import { DollarOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useCities } from "../../../../hooks/useCities";
import { useDistricts } from "../../../../hooks/useDistricts";
import { useWards } from "../../../../hooks/useWards";
import { JobApi } from "../../../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { EmployerSkillApi } from "../../../../services/modules/EmployerSkillServices";
import { Meta, ListSkillsFormData } from "../../../../types";
import { ChevronsLeft } from "lucide-react";
import moment from "moment";

interface IPropsJobDetail {
  idJob: string;
  handleChangeHome: () => void;
}
export default function JobDetail({
  idJob,
  handleChangeHome,
}: IPropsJobDetail) {
  const [jobDetail, setJobDetail] = useState<any>(null);
  const [form] = Form.useForm();
  const [experienceInput, setExperienceInput] = useState("");
  const [experienceList, setExperienceList] = useState([]);
  const [content, setContent] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [benefitList, setBenefitList] = useState([]);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const userDetail = useSelector((state) => state.user);
  const [expireDate, setExpireDate] = useState("");
  const [listSkills, setListSkills] = useState<ListSkillsFormData[]>([]);
  const [meta, setMeta] = useState<Meta>({
    count: 0,
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });
  const { cities, loading: citiesLoading } = useCities();
  const { districts, loading: districtLoading } = useDistricts(city);
  const { wards, loading: wardsLoading } = useWards(district);

  const [isNegotiable, setIsNegotiable] = useState(false);

  const handleNegotiableChange = (e) => {
    setIsNegotiable(e.target.checked);
  };
  const handleCityChange = (value) => {
    setCity(value);
  };
  const handleDistrictChange = (value) => {
    setDistrict(value);
  };
  useEffect(() => {
    if (jobDetail?.city_id) {
      setCity(jobDetail.city_id);
      setDistrict(jobDetail.district_id);
      setWard(jobDetail.ward_id);
    }
  }, [jobDetail]);
  const handleWardChange = (value) => {
    setWard(value);
  };
  const handleGetJobDetail = async () => {
    const res = await JobApi.getJobById(idJob, userDetail.access_token);
    console.log("resdadada,", res);
    if (res?.data) {
      let applicationMethod = "";
      let applicationLink = "";

      // Kiểm tra giá trị của apply_linkedin, apply_website, apply_email
      if (res.data.apply_linkedin && res.data.apply_linkedin !== "") {
        applicationMethod = "linkedin";
        applicationLink = res.data.apply_linkedin;
      } else if (res.data.apply_email && res.data.apply_email !== "") {
        applicationMethod = "email";
        applicationLink = res.data.apply_email;
      } else if (res.data.apply_website && res.data.apply_website !== "") {
        applicationMethod = "company";
        applicationLink = res.data.apply_website;
      }
      form.setFieldsValue({
        ...res.data,
        city: res.data.city_id,
        district: res.data.district_id,
        ward: res.data.ward_id,
        min_salary: res.data.salary_range.min,
        max_salary: res.data.salary_range.max,
        applicationMethod: applicationMethod,
        applicationLink: applicationLink,
        setExpireDate: moment(res.data.expire_date).format("YYYY-MM-DD"),
      });
      const formattedExpireDate = moment(res.data.expire_date).format('YYYY-MM-DD');
      setExpireDate(formattedExpireDate); 
      setIsNegotiable(res.data.is_negotiable);
      setExperienceList(res.data.require_experience);
      setJobDetail(res.data);
      setBenefitList(res.data.benefit);
    }
  };
  useEffect(() => {
    handleGetJobDetail();
  }, []);

  const handleAddBenefit = () => {
    if (benefitInput && !benefitList.includes(benefitInput)) {
      setBenefitList([...benefitList, benefitInput]);
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (benefitToRemove) => {
    setBenefitList(
      benefitList.filter((benefit) => benefit !== benefitToRemove)
    );
  };

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };
  const handleAddExperience = () => {
    if (experienceInput.trim()) {
      setExperienceList([...experienceList, experienceInput]);
      setExperienceInput("");
    }
  };
  const handleRemoveExperience = (removedExperience) => {
    setExperienceList(
      experienceList.filter((exp) => exp !== removedExperience)
    );
  };
  const handleGetSkillByUser = async (params: any) => {
    const res = await EmployerSkillApi.getSkillByUserId(
      userDetail.access_token,
      params
    );
    if (res?.data) {
      setListSkills(res?.data.items);
      setMeta(res?.data.meta);
    }
  };

  useEffect(() => {
    handleGetSkillByUser({ user_id: userDetail._id });
  }, []);
  const handleSubmit = async (values: any) => {
    const salaryRange = { min: values.min_salary, max: values.max_salary };

    let params = {
      user_id: userDetail._id,
      title: values.title,
      description: content,
      address:values.address,
      city_id: city,
      district_id: district,
      ward_id: ward,
      salary_range: salaryRange,
      salary_type: values.salary_type,
      job_type: values.job_type,
      benefit: benefitList,
      // time_work: values.time_work, 
      require_experience: experienceList,
      level: values.level,
      type_money: values.type_money,
      degree: values.degree,
      expire_date: expireDate,
      skills: values.skills,
      is_negotiable: values.is_negotiable,
      count_apply:values.count_apply,
      apply_linkedin: "",
      apply_website: "",
      apply_email: "",
    };
    if (values.applicationMethod === "linkedin") {
      params.apply_linkedin = values.applicationLink;
    } else if (values.applicationMethod === "email") {
      params.apply_email = values.applicationLink;
    } else if (values.applicationMethod === "website") {
      params.apply_website = values.applicationLink;
    }
    const res = await JobApi.updateJob(
      jobDetail._id,
      params,
      userDetail.access_token
    );

    if (res.data) {
      notification.success({
        message: "Success",
        description: "Update successfully",
      });
    } else {
      notification.error({
        message: "Error",
        description: res.message,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4">
        <ChevronsLeft
          className="cursor-pointer hover:text-primaryColor rounded-full"
          onClick={handleChangeHome}
          size={40}
        />
        <h2 className="text-lg font-semibold ">Thông tin chi tiết</h2>
      </div>
      <Form
        form={form}
        layout="vertical"
        className=" mx-auto"
        onFinish={handleSubmit}
      >
        {/* Job Title */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Infomation</h2>

          <Form.Item
            label="Job Title"
            name="title"
            rules={[{ required: true, message: "Job title is required" }]}
          >
            <Input placeholder="Add job title, role, vacancies etc..." />
          </Form.Item>
        </div>

        {/* Salary */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Salary</h2>

          <div className="flex justify-between flex-col">
            {/* Negotiable Salary Checkbox */}
            <Form.Item name="is_negotiable" valuePropName="checked">
              <Checkbox onChange={handleNegotiableChange}>
                Negotiable Salary (Lương thỏa thuận)
              </Checkbox>
            </Form.Item>

            {/* Min Salary */}
            <Form.Item
              label="Min Salary"
              name="min_salary"
              rules={[
                {
                  required: !isNegotiable,
                  message: "Minimum salary is required",
                },
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                className="w-[300px]"
                placeholder="Minimum salary..."
                addonAfter="USD"
                disabled={isNegotiable}
              />
            </Form.Item>

            {/* Max Salary */}
            <Form.Item
              label="Max Salary"
              name="max_salary"
              rules={[
                {
                  required: !isNegotiable,
                  message: "Maximum salary is required",
                },
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                className="w-[300px]"
                placeholder="Maximum salary..."
                addonAfter="USD"
                disabled={isNegotiable}
              />
            </Form.Item>

            {/* Salary Type */}
            <Form.Item
              label="Salary Type"
              name="salary_type"
              className="w-[300px]"
              rules={[
                {
                  required: !isNegotiable,
                  message: "Please select a salary type",
                },
              ]}
            >
              <Select placeholder="Select" disabled={isNegotiable}>
                <Select.Option value="yearly">Yearly</Select.Option>
                <Select.Option value="monthly">Monthly</Select.Option>
                <Select.Option value="hourly">Hourly</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>

        {/* Advanced Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Advanced Information</h2>

          <div className="">
            <Form.Item
              label="Skills"
              name="skills"
              rules={[
                {
                  required: true,
                  message: "Please select the required skills",
                },
              ]}
            >
              <Select
                placeholder="Chọn kỹ năng"
                mode="multiple" // Cho phép chọn nhiều kỹ năng
                style={{ width: "100%" }}
                onChange={(value) => {
                  console.log("Selected skills:", value);
                  console.log("Selected skills:", listSkills);
                }}
              >
                {listSkills.map((skill) => (
                  <Select.Option key={skill._id} value={skill._id}>
                    {skill.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Education"
              name="degree"
              rules={[
                {
                  required: true,
                  message: "Please select the required education level",
                },
              ]}
            >
              <Select placeholder="Select">
                <Select.Option value="bachelor">
                  Bachelor's Degree
                </Select.Option>
                <Select.Option value="master">Master's Degree</Select.Option>
                <Select.Option value="phd">PhD</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Experience Level"
              name="level"
              rules={[
                {
                  required: true,
                  message: "Please select the experience level",
                },
              ]}
            >
              <Select placeholder="Select">
                <Select.Option value="junior">Junior</Select.Option>
                <Select.Option value="mid">Mid</Select.Option>
                <Select.Option value="senior">Senior</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Experience"
              rules={[{ required: true, message: "Experience is required" }]}
            >
              <Input
                placeholder="Enter experience and press Enter..."
                value={experienceInput}
                onChange={(e) => setExperienceInput(e.target.value)}
                onPressEnter={handleAddExperience}
              />
              <Button
                type="primary"
                onClick={handleAddExperience}
                className="mt-2"
              >
                Add Experience
              </Button>
              <div className="mt-4">
                {experienceList.map((exp, index) => (
                  <Tag
                    key={index}
                    closable
                    onClose={() => handleRemoveExperience(exp)}
                    className="m-1"
                  >
                    {exp}
                  </Tag>
                ))}
              </div>
            </Form.Item>

            <Form.Item
              label="Job Type"
              name="job_type"
              rules={[{ required: true, message: "Please select a job type" }]}
            >
              <Select placeholder="Select">
                <Select.Option value="fulltime">Full Time</Select.Option>
                <Select.Option value="parttime">Part Time</Select.Option>
                <Select.Option value="contract">Contract</Select.Option>
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Count Apply"
              name="count_apply"
              rules={[
                {
                  required: true,
                  message: "Please enter the number of vacancies",
                },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="Number of positions..."
              />
            </Form.Item>

            <Form.Item
              label="Expiration Date"
              name="expire_date"
              rules={[
                { required: true, message: "Please select an expiration date" },
              ]}
            >
              <Input
                type="date"
                value={expireDate} // Đảm bảo giá trị là chuỗi theo định dạng 'YYYY-MM-DD'
                onChange={(e) => setExpireDate(e.target.value)} // Cập nhật giá trị khi người dùng thay đổi
              />
            </Form.Item>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Field */}
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

          <Form.Item name="isRemote" valuePropName="checked">
            <Checkbox>Fully Remote Position / Worldwide</Checkbox>
          </Form.Item>
        </div>

        {/* Job Benefits */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Job Benefits</h2>

          <Form.Item
            label="Benefits"
            rules={[
              { required: true, message: "Please add at least one benefit" },
            ]}
          >
            <Input
              placeholder="Enter benefit and press Enter..."
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onPressEnter={handleAddBenefit}
            />
            <Button type="primary" onClick={handleAddBenefit} className="mt-2">
              Add Benefit
            </Button>
            <div className="mt-4">
              {benefitList.map((benefit, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveBenefit(benefit)}
                  className="m-1"
                >
                  {benefit}
                </Tag>
              ))}
            </div>
          </Form.Item>
        </div>

        {/* Job Description */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Job Description</h2>

          <Form.Item
            name="description"
            rules={[{ required: true, message: "Job description is required" }]}
          >
            <Editor
              // apiKey={process.env.REACT_APP_TINYMCE_API_KEY} // Bạn có thể lấy API key miễn phí từ TinyMCE
              apiKey="px41kgaxf4w89e8p41q6zuhpup6ve0myw5lzxzlf0gc06zh3"
              initialValue=""
              init={{
                height: 500,
                menubar: false,
                plugins: [
                  "advlist autolink lists link image charmap print preview anchor",
                  "searchreplace visualblocks code fullscreen",
                  "insertdatetime media table paste code help wordcount",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | \
            alignleft aligncenter alignright alignjustify | \
            bullist numlist outdent indent | removeformat | help",
              }}
              onEditorChange={handleEditorChange}
            />
          </Form.Item>
        </div>

        {/* Application Method */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Apply Job on:</h2>

          <Form.Item
            name="applicationMethod"
            rules={[
              {
                required: true,
                message: "Please select an application method",
              },
            ]}
          >
            <Radio.Group>
              <Radio value="linkedin">LinkedIn</Radio>
              <Radio value="company">Company website</Radio>
              <Radio value="email">Email</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="applicationLink"
            rules={[
              { required: true, message: "Please enter the application link" },
            ]}
          >
            <Input placeholder="Enter application URL or email" />
          </Form.Item>
        </div>

        {/* Image Company s */}
        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Update
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
