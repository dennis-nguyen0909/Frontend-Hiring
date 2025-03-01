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
  DatePicker,
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
import { ChevronsLeft } from "lucide-react";
import { useCurrency } from "../../../../hooks/useCurrency";
import { useLevels } from "../../../../hooks/useLevels";
import { useContractType } from "../../../../hooks/useContractType";
import { useDegreeType } from "../../../../hooks/useDegreeType";
import { useJobType } from "../../../../hooks/useJobType";
import GeneralModal from "../../../../components/ui/GeneralModal/GeneralModal";
import { useNavigate, useParams } from "react-router-dom";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
const { Title, Text } = Typography;
interface IPropsJobDetail {
  idJob?: string;
  handleChangeHome?: () => void;
}
export default function JobDetail({
  idJob,
  handleChangeHome,
}: IPropsJobDetail) {
  const { t } = useTranslation();
  const userDetail = useSelector((state) => state.user);
  const [jobDetail, setJobDetail] = useState<any>(null);
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [benefitList, setBenefitList] = useState([]);
  const [city, setCity] = useState(jobDetail?.city_id?._id || "");
  const [district, setDistrict] = useState(jobDetail?.district_id?._id || "");
  const [ward, setWard] = useState(jobDetail?.ward_id?._id || "");
  const [expireDate, setExpireDate] = useState("");
  const [listSkills, setListSkills] = useState<ListSkillsFormData[]>([]);
  const { data: listLevels } = useLevels();
  const { data: listContractTypes } = useContractType();
  const { data: listDegreeTypes } = useDegreeType();
  const { data: listJobTypes } = useJobType();
  const { data: listCurrencies } = useCurrency();
  const [meta, setMeta] = useState<Meta>({
    count: 0,
    current_page: 1,
    per_page: 10,
    total: 0,
    total_pages: 0,
  });
  const { formatDate } = useMomentFn();
  const { cities, loading: citiesLoading } = useCities();
  const { districts, loading: districtLoading } = useDistricts(city);
  const { wards, loading: wardsLoading } = useWards(district);
  const [isNegotiable, setIsNegotiable] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [currentSection, setCurrentSection] = useState(""); // Để theo dõi phần tựa đề hiện tại
  const [typeModal, setTypeModal] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const navigate = useNavigate();
  const location = useParams();
  const handleOpenModal = (type: string) => {
    setTypeModal(type);
    setIsModalVisible(true);
  };
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewSkill("");
  };
  const handleSkillChange = (value) => {
    setSelectedSkills(value);
  };

  const handleAddNewSkill = async () => {
    const res = await EmployerSkillApi.postSkill(
      { name: newSkill, user_id: userDetail?._id },
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      handleGetSkillByUser({});
      setIsModalVisible(false);
    } else {
      notification.error({
        message: t("notification"),
        description: t("create_failed"),
      });
    }
  };
  const renderBody = (type: string) => {
    switch (type) {
      case "add-skill":
        return (
          <>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Input
                placeholder={t("enter_skill_name")}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </Space>
            <div className="flex justify-between items-center mt-10">
              <Button key="cancel" onClick={handleCloseModal}>
                {t("cancel")}
              </Button>
              ,
              <Button key="submit" type="primary" onClick={handleAddNewSkill}>
                {t("add_skill")}
              </Button>
            </div>
          </>
        );
    }
  };
  // Thêm yêu cầu vào đúng tựa đề
  const addRequirement = () => {
    if (!newTitle || !newRequirement) {
      message.error(t("please_enter_title_and_requirement"));
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
      setCity(jobDetail.city_id._id);
      setDistrict(jobDetail.district_id._id);
      setWard(jobDetail.ward_id._id);
    }
  }, [jobDetail]);
  const handleWardChange = (value) => {
    setWard(value);
  };
  const handleGetJobDetail = async () => {
    const res = await JobApi.getJobById(
      idJob || location?.id,
      userDetail.access_token
    );
    if (res?.data) {
      let applicationMethod = "";
      let applicationLink = "";
      const skillIds = res.data.skills.map((skill) => skill._id);
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
      console.log("res.data", formatDate(res.data.expire_date));
      const formattedExpireDate = res.data.expire_date;
      form.setFieldsValue({
        ...res.data,
        min_salary: res.data.salary_range_min,
        max_salary: res.data.salary_range_max,
        min_age: res.data.age_range.min,
        max_age: res.data.age_range.max,
        applicationMethod: applicationMethod,
        applicationLink: applicationLink,
        professional_skills: res.data.professional_skills,
        city: res.data.city_id._id,
        district: res.data.district_id._id,
        ward: res.data.ward_id._id,
        expire_date: formattedExpireDate,
        skills: skillIds,
        type_money: res.data.type_money._id,
        degree: res.data.degree._id,
        level: res.data.level._id,
        job_contract_type: res?.data?.job_contract_type?._id,
        job_type: res.data.job_type._id,
      });
      setRequirements(res.data.professional_skills);
      setExpireDate(formattedExpireDate);
      setIsNegotiable(res.data.is_negotiable);
      setJobDetail(res.data);
      setBenefitList(res.data.benefit);
      setListSkills([...res.data.skills]);
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
  const handleGetSkillByUser = async (params: any) => {
    const res = await EmployerSkillApi.getSkillByUserId(
      userDetail.access_token,
      params
    );
    if (res?.data) {
      setListSkills(res.data.items);
      setMeta(res?.data.meta);
    }
  };

  useEffect(() => {
    handleGetSkillByUser({ user_id: userDetail?._id });
  }, []);
  const handleSubmit = async (values: any) => {
    const salaryRange = { min: values.min_salary, max: values.max_salary };
    if (!requirements.length) {
      notification.error({
        message: t("notification"),
        description: t("please_enter_skill_and_specialty"),
      });
      message.error(t("please_enter_skill_and_specialty"));
      return;
    }
    if (!values.general_requirements.length) {
      notification.error({
        message: t("notification"),
        description: t("please_enter_general_requirement"),
      });
      message.error(t("please_enter_general_requirement"));

      return;
    }
    if (!values.job_responsibilities.length) {
      notification.error({
        message: t("notification"),
        description: t("please_enter_job_responsibility"),
      });
      message.error(t("please_enter_job_responsibility"));

      return;
    }
    if (!values.interview_process.length) {
      notification.error({
        message: t("notification"),
        description: t("please_enter_interview_process"),
      });
      message.error(t("please_enter_interview_process"));

      return;
    }
    const params = {
      user_id: userDetail?._id,
      title: values.title,
      description: content,
      address: values.address,
      city_id: city,
      district_id: district,
      ward_id: ward,
      salary_range_min: values.min_salary,
      salary_range_max: values.max_salary,
      salary_type: values.salary_type,
      job_contract_type: values.job_contract_type,
      benefit: benefitList,
      level: values.level,
      type_money: values.type_money,
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
      min_experience: +values.min_experience,
    };
    if (values.applicationMethod === "linkedin") {
      params.apply_linkedin = values.applicationLink;
    } else if (values.applicationMethod === "email") {
      params.apply_email = values.applicationLink;
    } else if (values.applicationMethod === "company") {
      params.apply_website = values.applicationLink;
    }
    const res = await JobApi.updateJob(
      jobDetail._id,
      params,
      userDetail.access_token
    );

    if (res.data) {
      message.success(t("update_successfully"));
    } else {
      notification.error({
        message: t("notification"),
        description: res.message,
      });
    }
  };
  const handleFinishFailed = ({ errorFields }: any) => {
    errorFields.forEach((field: any) => {
      notification.error({
        message: t("notification"),
        description: field.errors[0], // Display the first validation error for each field
      });
      message.error(field.errors[0]);
    });
  };
  const handleNavigateBack = () => {
    navigate(-1);
  };
  const onBack = handleChangeHome || handleNavigateBack;
  return (
    <div className="px-primaryx2 pt-8 bg-gray-50 min-h-screen">
      <div className="flex items-center gap-4">
        <ChevronsLeft
          className="cursor-pointer hover:text-primaryColor rounded-full"
          onClick={onBack}
          size={40}
        />
        <h2 className="text-lg font-semibold ">{t("job_detail")}</h2>
      </div>
      <Form
        form={form}
        layout="vertical"
        className="mx-auto pt-5"
        onFinishFailed={handleFinishFailed}
        onFinish={handleSubmit}
        initialValues={{
          city: jobDetail?.city_id,
        }}
      >
        {/* Job Title */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <Form.Item
            label={t("job_title")}
            name="title"
            rules={[{ required: true, message: t("job_title_is_required") }]}
          >
            <Input placeholder={t("add_job_title")} />
          </Form.Item>
        </div>

        {/* Salary */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">{t("salary")}</h2>

          <div className="flex justify-between flex-col">
            {/* Negotiable Salary Checkbox */}
            <Form.Item name="is_negotiable" valuePropName="checked">
              <Checkbox onChange={handleNegotiableChange}>
                {t("negotiable_salary")}
              </Checkbox>
            </Form.Item>

            {/* Min Salary */}
            <Form.Item
              label={t("minimum_salary")}
              name="min_salary"
              rules={[
                {
                  required: !isNegotiable,
                  message: t("please_enter_minimum_salary"),
                },
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                className="w-[300px]"
                placeholder={t("minimum_salary")}
                addonAfter="USD"
                disabled={isNegotiable}
              />
            </Form.Item>

            {/* Max Salary */}
            <Form.Item
              label={t("maximum_salary")}
              name="max_salary"
              rules={[
                {
                  required: !isNegotiable,
                  message: t("maximum_salary_is_required"),
                },
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined />}
                className="w-[300px]"
                placeholder={t("maximum_salary")}
                addonAfter="USD"
                disabled={isNegotiable}
              />
            </Form.Item>

            {/* Salary Type */}
            <Form.Item
              label={t("salary_type")}
              name="salary_type"
              className="w-[300px]"
              rules={[
                {
                  required: !isNegotiable,
                  message: t("please_select_salary_type"),
                },
              ]}
            >
              <Select
                placeholder={t("select_salary_type")}
                disabled={isNegotiable}
              >
                <Select.Option value="yearly">{t("monthly")}</Select.Option>
                <Select.Option value="monthly">{t("yearly")}</Select.Option>
                <Select.Option value="hourly">{t("hourly")}</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label={t("money_type")}
              name="type_money"
              className="w-[300px]"
              rules={[
                { required: true, message: t("please_select_money_type") },
              ]}
            >
              <Select placeholder={t("select_money_type")}>
                {listCurrencies.map((currency) => {
                  return (
                    <Select.Option key={currency._id} value={currency._id}>
                      {currency.code}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>
        </div>
        <section className="p-6 bg-white rounded-lg shadow-md mb-4">
          <Title level={5} className="text-xl font-semibold">
            <span className="text-red-500">*</span>{" "}
            {t("skills_and_specialties")}
          </Title>

          <div className="space-y-6">
            {requirements.map((section, index) => (
              <div key={index}>
                <Text strong className="text-lg">
                  {section.title}
                </Text>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="text-gray-700">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            {/* Phần nhập liệu cho yêu cầu mới */}
            <div className="mt-6">
              <Space direction="vertical" size="large" className="w-full">
                <Input
                  placeholder={t("enter_title")}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="shadow-sm rounded-md border-gray-300"
                />
                <Input
                  placeholder={t("enter_requirement")}
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="shadow-sm rounded-md border-gray-300"
                />
                <Button
                  type="primary"
                  onClick={addRequirement}
                  className="w-full py-2 mt-4"
                >
                  {t("add_requirement")}
                </Button>
              </Space>
            </div>

            {/* Hiển thị tựa đề hiện tại mà người dùng đang chỉnh sửa */}
            {currentSection && (
              <div className="mt-4 text-gray-600">
                <Text strong>
                  {t("editing_section")}: {currentSection}
                </Text>
              </div>
            )}

            {/* Nút để thêm tựa đề mới */}
            {newTitle && (
              <Button
                type="default"
                onClick={handleAddNewSection}
                className="mt-4 w-full py-2"
              >
                {t("add_section")}
              </Button>
            )}
          </div>
        </section>
        {/* Advanced Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">
            {t("advanced_information")}
          </h2>
          <Form.Item
            name="min_age"
            label={t("minimum_age")}
            rules={[
              {
                required: true,
                message: t("please_enter_minimum_age"),
              },
              {
                type: "number",
                min: 18,
                max: 65,
                message: t("age_must_be_between_18_and_65"),
              },
            ]}
          >
            <InputNumber min={18} max={65} placeholder={t("minimum_age")} />
          </Form.Item>

          <Form.Item
            name="max_age"
            label={t("maximum_age")}
            rules={[
              {
                required: true,
                message: t("please_enter_maximum_age"),
              },
              {
                type: "number",
                min: 18,
                max: 65,
                message: t("age_must_be_between_18_and_65"),
              },
            ]}
          >
            <InputNumber min={18} max={65} placeholder={t("maximum_age")} />
          </Form.Item>
          <div className="">
            <Form.Item
              label={t("skills_required")}
              name="skills"
              rules={[
                {
                  required: true,
                  message: t("please_select_skills_required"),
                },
              ]}
            >
              <Select
                placeholder={t("select_skills_required")}
                mode="multiple"
                style={{ width: "100%" }}
                value={selectedSkills}
                onChange={handleSkillChange}
              >
                {listSkills.map((skill) => (
                  <Select.Option key={skill._id} value={skill._id}>
                    {skill.name}
                  </Select.Option>
                ))}

                {/* Hiển thị dấu + nếu chưa có kỹ năng nào được chọn */}
                <Select.Option key="add-skill" value="add-skill" disabled>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenModal("add-skill")}
                    style={{ width: "100%" }}
                  >
                    Thêm kỹ năng mới
                  </Button>
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={t("education")}
              name="degree"
              rules={[
                {
                  required: true,
                  message: t("please_select_education"),
                },
              ]}
            >
              <Select placeholder={t("select_education")}>
                {listDegreeTypes.map((degree, idx) => {
                  return (
                    <Select.Option key={degree.key} value={degree._id}>
                      {degree.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label={t("level_required")}
              name="level"
              rules={[
                {
                  required: true,
                  message: t("please_select_level_required"),
                },
              ]}
            >
              <Select placeholder={t("select_level_required")}>
                {listLevels.map((level, idx) => {
                  return (
                    <Select.Option value={level._id}>
                      {level.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            <Form.List name="general_requirements">
              {(fields, { add, remove }) => (
                <>
                  <label>
                    <span style={{ color: "red" }}>*</span>
                    {t("general_requirements")}
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
                            message: t("please_enter_general_requirements"),
                          },
                        ]}
                      >
                        <Input placeholder={t("general_requirements")} />
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
                      {t("add_general_requirements")}
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
                    {t("job_responsibilities")}
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
                            message: t("please_enter_job_responsibilities"),
                          },
                        ]}
                      >
                        <Input placeholder={t("job_responsibilities")} />
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
                      {t("add_job_responsibilities")}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.List name="interview_process">
              {(fields, { add, remove }) => (
                <>
                  <label>
                    <span style={{ color: "red" }}>*</span>
                    {t("interview_process")}
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
                            message: t("please_enter_interview_process"),
                          },
                        ]}
                      >
                        <Input placeholder={t("interview_process")} />
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
                      {t("add_interview_process")}
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>

            <Form.Item
              label={t("job_contract_type")}
              name="job_contract_type"
              rules={[
                {
                  required: true,
                  message: t("please_select_job_contract_type"),
                },
              ]}
            >
              <Select placeholder={t("select_job_contract_type")}>
                {listContractTypes.map((type, idx) => {
                  return (
                    <Select.Option key={type.key} value={type._id}>
                      {type.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={t("number_of_applications")}
              name="count_apply"
              rules={[
                {
                  required: true,
                  message: t("please_enter_number_of_applications"),
                },
              ]}
            >
              <InputNumber
                className="w-full"
                placeholder={t("enter_number_of_applications")}
              />
            </Form.Item>

            <Form.Item
              label={t("expire_date")}
              name="expire_date"
              rules={[
                { required: true, message: t("please_select_expire_date") },
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
          <h2 className="text-lg font-semibold mb-4">{t("location")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Field */}
            <Form.Item
              label={t("city")}
              name="city"
              rules={[{ required: true, message: t("please_select_city") }]}
            >
              <Select
                placeholder={t("select_city")}
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
              label={t("district")}
              name="district"
              rules={[{ required: true, message: t("please_select_district") }]}
            >
              <Select
                placeholder={t("select_district")}
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
              label={t("ward")}
              name="ward"
              rules={[{ required: true, message: t("please_select_ward") }]}
            >
              <Select
                placeholder={t("select_ward")}
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
            <Form.Item label={t("address")} name="address">
              <Input placeholder={t("please_enter_address")} />
            </Form.Item>
          </div>

          {/* <Form.Item name="isRemote" valuePropName="checked">
            <Checkbox>Fully Remote Position / Worldwide</Checkbox>
          </Form.Item> */}
        </div>

        {/* Job Benefits */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">{t("job_benefits")}</h2>

          <Form.Item
            label="Benefits"
            rules={[
              {
                required: true,
                message: t("please_select_at_least_1_benefit"),
              },
            ]}
          >
            <Input
              placeholder={t("please_enter_job_benefits")}
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onPressEnter={handleAddBenefit}
            />
            <Button type="primary" onClick={handleAddBenefit} className="mt-2">
              {t("add")}
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
            label={t("min_experience")}
            rules={[
              {
                required: true,
                message: t("please_enter_min_experience"),
              },
            ]}
          >
            <InputNumber defaultValue={1} placeholder="..." />
          </Form.Item>

          <Form.Item
            name="job_type"
            label={t("job_type")}
            rules={[
              {
                required: true,
                message: t("please_enter_job_type"),
              },
            ]}
          >
            <Select placeholder={t("choose_job_type")}>
              {listJobTypes?.map((jobType) => {
                return (
                  <Select.Option key={jobType._id} value={jobType._id}>
                    {jobType.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>

        {/* Job Mô tả */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-lg font-semibold mb-4">{t("job_description")}</h2>

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
          <h2 className="text-lg font-semibold mb-4">{t("apply_job_on")}</h2>

          <Form.Item
            name="applicationMethod"
            rules={[
              {
                required: true,
                message: t("please_select_application_method"),
              },
            ]}
          >
            <Radio.Group>
              <Radio value="linkedin">{t("linkedin")}</Radio>
              <Radio value="company">{t("company_website")}</Radio>
              <Radio value="email">{t("email")}</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="applicationLink"
            rules={[
              {
                required: true,
                message: t("please_enter_application_link"),
              },
            ]}
          >
            <Input placeholder={t("please_enter_application_link")} />
          </Form.Item>
        </div>

        {/* Image Company s */}
        {/* Submit Button */}
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            {t("update")}
          </Button>
        </Form.Item>
      </Form>
      <GeneralModal
        title={t("add")}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        renderBody={() => renderBody(typeModal)}
        // footer={false}
      />
    </div>
  );
}
