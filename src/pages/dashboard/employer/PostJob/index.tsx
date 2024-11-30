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
  Space,
  message,
  Typography,
} from "antd";
import { Editor } from "@tinymce/tinymce-react";
import {
  DollarOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useCities } from "../../../../hooks/useCities";
import { useDistricts } from "../../../../hooks/useDistricts";
import { useWards } from "../../../../hooks/useWards";
import { JobApi } from "../../../../services/modules/jobServices";
import { useSelector } from "react-redux";
import { EmployerSkillApi } from "../../../../services/modules/EmployerSkillServices";
import { Meta, ListSkillsFormData } from "../../../../types";
const { Title, Text } = Typography;
export default function PostJob() {
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

  const handleWardChange = (value) => {
    setWard(value);
  };

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
  const [requirements, setRequirements] = useState([]);

  const [newTitle, setNewTitle] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [currentSection, setCurrentSection] = useState(""); // Để theo dõi phần tựa đề hiện tại

  // Thêm yêu cầu vào đúng tựa đề
  const addRequirement = () => {
    if (!newTitle || !newRequirement) {
      message.error("Vui lòng nhập đủ tựa đề và yêu cầu");
      return;
    }

    const newRequirements = [...requirements];

    // Kiểm tra xem nhóm với tựa đề newTitle đã tồn tại hay chưa
    const targetSection = newRequirements.find(
      (section) => section.title === newTitle.trim()
    );

    if (targetSection) {
      // Nếu tìm thấy nhóm tương ứng với tựa đề, thêm yêu cầu vào nhóm đó
      targetSection.items.push(newRequirement);
      setRequirements(newRequirements);
    } else {
      // Nếu không tìm thấy nhóm với tựa đề, tạo nhóm mới
      newRequirements.push({ title: newTitle.trim(), items: [newRequirement] });
      setRequirements(newRequirements);
    }

    // Reset lại input yêu cầu sau khi thêm
    setNewRequirement("");
    setCurrentSection(newTitle.trim()); // Cập nhật phần tựa đề hiện tại
  };

  // Hiển thị lại ô nhập tựa đề khi người dùng muốn chuyển tới tựa đề mới
  const handleAddNewSection = () => {
    setNewTitle(""); // Reset giá trị ô nhập tựa đề
    setNewRequirement(""); // Reset giá trị ô nhập yêu cầu
  };
  useEffect(() => {
    handleGetSkillByUser({ user_id: userDetail._id });
  }, []);
  const handleFinishFailed = ({ errorFields }: any) => {
    errorFields.forEach((field: any) => {
      notification.error({
        message: "Thông báo",
        description: field.errors[0], // Display the first validation error for each field
      });
    });
  };
  const handleSubmit = async (values: any) => {
    try {
      console.log("reqweqweq", !values.general_requirements.length);
      if (!requirements.length) {
        notification.error({
          message: "Thông báo",
          description: "Vui lòng nhập kỹ năng và chuyên môn",
        });
        return;
      }

      if (!values.general_requirements || !values.general_requirements.length) {
        message.error('Vui lòng nhập yêu cầu chung')

        // notification.error({
        //   message: "Thông báo",
        //   description: "Vui lòng nhập yêu cầu chung",
        // });
        return; // Nếu cần dừng thực hiện sau khi hiển thị thông báo
      }
      if (!values.job_responsibilities.length) {
        message.error('Vui lòng nhập trách nhiệm công việc')
        // notification.error({
        //   message: "Thông báo",
        //   description: "Vui lòng nhập trách nhiệm công việc",
        // });
        return;
      }
      if(!values.interview_process.length){
        message.error('Vui lòng nhập quy trình phỏng vấn')

        // notification.error({
        //   message: "Thông báo",
        //   description: "Vui lòng nhập quy trình phỏng vấn",
        // });
        return;
      }
      const salaryRange = { min: values.min_salary, max: values.max_salary };
      const ageRange = { min: values.min_age, max: values.max_age };
      let params = {
        user_id: userDetail._id,
        title: values.title,
        description: content,
        address: values.address,
        city_id: city,
        district_id: district,
        ward_id: ward,
        salary_range: salaryRange,
        age_range: ageRange,
        salary_type: values.salary_type,
        job_type: values.job_type,
        benefit: benefitList,
        // time_work: values.time_work,
        require_experience: experienceList,
        level: values.level,
        type_money: values.type_money, //
        degree: values.degree,
        expire_date: expireDate,
        skills: values.skills,
        is_negotiable: values.is_negotiable,
        count_apply: values.count_apply,
        apply_linkedin: "",
        apply_website: "",
        apply_email: "",
        professional_skills: requirements,
        general_requirements: values.general_requirements,
        job_responsibilities: values.job_responsibilities,
        interview_process: values.interview_process,
        type_of_work: values.type_of_work,
        min_experience: values.min_experience,
      };
      if (values.applicationMethod === "linkedin") {
        params.apply_linkedin = values.applicationLink;
      } else if (values.applicationMethod === "email") {
        params.apply_email = values.applicationLink;
      } else if (values.applicationMethod === "website") {
        params.apply_website = values.applicationLink;
      }
      const res = await JobApi.postJob(params, userDetail.access_token);
      if (res.data && +res.statusCode === 201) {
        message.success('Tạo thành công')
        // notification.success({
        //   message: "Success",
        //   description: "Job posted successfully",
        // });
      } else {
        notification.error({
          message: "Error",
          description: res.message,
        });
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error,
      });
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <Form
        form={form}
        layout="vertical"
        className="max-w-4xl mx-auto"
        onFinishFailed={handleFinishFailed}
        onFinish={(values) => {
          console.log("Form submitted with values: ", values);
          handleSubmit(values);
        }}
      >
        {/* Job Title */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Đăng công việc</h2>

          <Form.Item
            label="Tiêu đề"
            name="title"
            rules={[
              { required: true, message: "Tiêu đề công việc là bắt buộc" },
            ]}
          >
            <Input placeholder="Thêm tiêu đề công việc ..." />
          </Form.Item>
        </div>

        {/* Salary */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Lương</h2>

          <div className="flex justify-between flex-col">
            {/* Negotiable Salary Checkbox */}
            <Form.Item name="is_negotiable" valuePropName="checked">
              <Checkbox onChange={handleNegotiableChange}>
                Lương thỏa thuận
              </Checkbox>
            </Form.Item>

            {/* Min Salary */}
            <Form.Item
              label="Mức lương tối thiểu"
              name="min_salary"
              rules={[
                {
                  required: !isNegotiable,
                  message: "Vui lòng nhập lương tối thiểu!",
                },
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                className="w-[300px]"
                placeholder="Lương tối thiểu..."
                addonAfter="USD"
                disabled={isNegotiable}
              />
            </Form.Item>

            {/* Max Salary */}
            <Form.Item
              label="Mức lương tối đa"
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
              label="Loại trả lương"
              name="salary_type"
              className="w-[300px]"
              rules={[
                {
                  required: !isNegotiable,
                  message: "Vui lòng chọn loại trả lương",
                },
              ]}
            >
              <Select placeholder="Select" disabled={isNegotiable}>
                <Select.Option value="yearly">Theo tháng</Select.Option>
                <Select.Option value="monthly">Theo năm</Select.Option>
                <Select.Option value="hourly">Theo giờ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Loại tiền"
              name="type_money"
              className="w-[300px]"
              rules={[
                { required: true, message: "Please select a money type" },
              ]}
            >
              <Select placeholder="Select money type">
                <Select.Option value="USD">USD</Select.Option>
                <Select.Option value="VIETNAM_DONG">
                  Vietnamese Dong
                </Select.Option>
                <Select.Option value="EUR">EUR</Select.Option>
              </Select>
            </Form.Item>
          </div>
        </div>
        <section>
          <section>
            <Title level={5}>
              <span style={{ color: "red" }}>*</span> <span> </span>
              Kỹ năng & Chuyên môn
            </Title>

            <div className="space-y-4">
              {requirements.map((section, index) => (
                <div key={index}>
                  <Text strong>{section.title}</Text>
                  <ul className="list-disc pl-5 space-y-2">
                    {section.items.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Phần nhập liệu cho yêu cầu mới */}
              <div>
                <Space direction="vertical" size="large">
                  <Input
                    placeholder="Nhập tựa đề (ví dụ: 2 năm kinh nghiệm)"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                  />
                  <Input
                    placeholder="Nhập yêu cầu"
                    value={newRequirement}
                    onChange={(e) => setNewRequirement(e.target.value)}
                  />
                  <Button type="primary" onClick={addRequirement}>
                    Thêm yêu cầu
                  </Button>
                </Space>
              </div>

              {/* Hiển thị tựa đề hiện tại mà người dùng đang chỉnh sửa */}
              {currentSection && (
                <div style={{ marginTop: 20 }}>
                  <Text strong>Đang chỉnh sửa phần: {currentSection}</Text>
                </div>
              )}

              {/* Nút để thêm tựa đề mới */}
              {newTitle && (
                <Button
                  type="default"
                  onClick={handleAddNewSection}
                  style={{ marginTop: 10 }}
                >
                  Thêm tựa đề mới
                </Button>
              )}
            </div>
          </section>
        </section>
        {/* Advanced Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Thông tin nâng cao</h2>
          <Form.Item
            name="min_age"
            label="Tuổi tối thiểu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tuổi tối thiểu",
              },
              {
                type: "number",
                min: 18,
                max: 65,
                message: "Tuổi phải từ 18 đến 65",
              },
            ]}
          >
            <InputNumber min={18} max={65} placeholder="Tuổi tối thiểu" />
          </Form.Item>

          <Form.Item
            name="max_age"
            label="Tuổi tối đa"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tuổi tối đa",
              },
              {
                type: "number",
                min: 18,
                max: 65,
                message: "Tuổi phải từ 18 đến 65",
              },
            ]}
          >
            <InputNumber min={18} max={65} placeholder="Tuổi tối đa" />
          </Form.Item>
          <div className="">
            <Form.Item
              label="Kỹ năng cần có"
              name="skills"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn kỹ năng yêu cầu",
                },
              ]}
            >
              <Select
                placeholder="Chọn kỹ năng"
                mode="multiple"
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
              label="Giáo dục"
              name="degree"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trình độ giáo dục",
                },
              ]}
            >
              <Select placeholder="Select">
                <Select.Option value="Bachelor">Bằng cử nhân</Select.Option>
                <Select.Option value="Master">Bằng thạc sĩ</Select.Option>
                <Select.Option value="PhD">Bằng tiến sĩ</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Mức độ kinh nghiệm"
              name="level"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn mức độ kinh nghiệm",
                },
              ]}
            >
              <Select placeholder="Select">
                <Select.Option value="junior">Junior</Select.Option>
                <Select.Option value="mid">Mid</Select.Option>
                <Select.Option value="senior">Senior</Select.Option>
              </Select>
            </Form.Item>

            {/* Yêu cầu chung */}
            <Form.List name="general_requirements">
              {(fields, { add, remove }) => (
                <>
                  <label>
                    <span style={{ color: "red" }}>*</span>
                    Yêu cầu chung:
                  </label>
                  {fields.map((field, index) => (
                    <Space
                      key={field.key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, "requirement"]}
                        fieldKey={[field.fieldKey, "requirement"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập yêu cầu chung",
                          },
                        ]}
                      >
                        <Input placeholder="Yêu cầu chung" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm Yêu cầu
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.List name="job_responsibilities">
              {(fields, { add, remove }) => (
                <>
                  <label>
                    <span style={{ color: "red" }}>*</span>
                    Trách nhiệm công việc:
                  </label>
                  {fields.map((field, index) => (
                    <Space
                      key={field.key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, "responsibility"]}
                        fieldKey={[field.fieldKey, "responsibility"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập trách nhiệm công việc",
                          },
                        ]}
                      >
                        <Input placeholder="Trách nhiệm công việc" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm Trách nhiệm công việc
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            {/* Quy trình phỏng vấn */}
            <Form.List name="interview_process">
              {(fields, { add, remove }) => (
                <>
                  <label>
                    <span style={{ color: "red" }}>*</span>
                    Quy trình phỏng vấn:
                  </label>
                  {fields.map((field, index) => (
                    <Space
                      key={field.key}
                      style={{ display: "flex", marginBottom: 8 }}
                      align="start"
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, "process"]}
                        fieldKey={[field.fieldKey, "process"]}
                        rules={[
                          {
                            required: true,
                            message: "Vui lòng nhập quy trình phỏng vấn",
                          },
                        ]}
                      >
                        <Input placeholder="Quy trình phỏng vấn" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm Quy trình phỏng vấn
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            {/* <Form.Item
              label="Kinh nghiệm bắt buộc"
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
                Thêm
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
            </Form.Item> */}

            <Form.Item
              label="Loại hợp đồng"
              name="job_type"
              rules={[
                { required: true, message: "Vui lòng chọn loại hợp đồng" },
              ]}
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
              label="Số lượng tuyển"
              name="count_apply"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lượng tuyển",
                },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder="Số lượng cho vị trí tuyển.."
              />
            </Form.Item>

            <Form.Item
              label="Ngày hết hạn"
              name="expire_date"
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn" },
              ]}
            >
              <Input
                type="date"
                onChange={(e) => setExpireDate(e.target.value)}
              />
            </Form.Item>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Vị trí làm việc</h2>

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

          <Form.Item name="isRemote" valuePropName="checked">
            <Checkbox>Fully Remote Position / Worldwide</Checkbox>
          </Form.Item>
        </div>

        {/* Job Benefits */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Phúc lợi cho ứng viên</h2>

          <Form.Item
            label="Phúc lợi"
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất 1 lợi ích" },
            ]}
          >
            <Input
              placeholder="Vui lòng nhập phúc lợi cho ứng viên"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onPressEnter={handleAddBenefit}
            />
            <Button type="primary" onClick={handleAddBenefit} className="mt-2">
              Thêm
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
          <Form.Item
            name="min_experience"
            label="Kinh nghiệm tối thiểu ( Năm )"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập kinh nghiệm tối thiểu",
              },
            ]}
          >
            <InputNumber min={2} placeholder="..." />
          </Form.Item>

          {/* Thêm trường Loại hình công việc */}
          <Form.Item
            name="type_of_work"
            label="Loại hình làm việc"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại hình làm việc",
              },
            ]}
          >
            <Select placeholder="Chọn loại hình">
              <Select.Option value="in_office">
                In Office (Tại văn phòng)
              </Select.Option>
              <Select.Option value="remote">Remote (Từ xa)</Select.Option>
              <Select.Option value="freelance">
                Freelance (Làm trực tuyến)
              </Select.Option>
            </Select>
          </Form.Item>
        </div>

        {/* Job Description */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">Mô tả công việc</h2>

          <Form.Item name="description">
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
          <h2 className="text-lg font-semibold mb-4">
            Ứng tuyển công việc trên :
          </h2>

          <Form.Item
            name="applicationMethod"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại nộp đơn xin việc",
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
              {
                required: true,
                message: "Vui lòng nhập liên kết đơn ứng tuyển",
              },
            ]}
          >
            <Input placeholder="Vui lòng nhập URL hoặc Email" />
          </Form.Item>
        </div>

        {/* Image Company s */}
        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Lưu
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
