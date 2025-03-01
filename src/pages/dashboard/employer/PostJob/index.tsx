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
import { useLevels } from "../../../../hooks/useLevels";
import { useContractType } from "../../../../hooks/useContractType";
import { useDegreeType } from "../../../../hooks/useDegreeType";
import { useJobType } from "../../../../hooks/useJobType";
import { useCurrency } from "../../../../hooks/useCurrency";
import GeneralModal from "../../../../components/ui/GeneralModal/GeneralModal";
import { DEGREE_TYPE_API } from "../../../../services/modules/DegreeTypeService";
import { Level_API } from "../../../../services/modules/LevelServices";
import { JOB_CONTRACT_TYPE_API } from "../../../../services/modules/JobContractTypeService";
import { JOB_TYPE_API } from "../../../../services/modules/JobTypeServices";
import { CURRENCY_API } from "../../../../services/modules/CurrenciesServices";
import LoadingComponent from "../../../../components/Loading/LoadingComponent";
import useMomentFn from "../../../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
const { Title, Text } = Typography;
export default function PostJob() {
  const { formatDate } = useMomentFn();
  const [form] = Form.useForm();
  const [content, setContent] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [benefitList, setBenefitList] = useState([]);
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const userDetail = useSelector((state) => state.user);
  const [typeModal, setTypeModal] = useState<string>("");
  const [expireDate, setExpireDate] = useState();
  const [listSkills, setListSkills] = useState<ListSkillsFormData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: listLevels, refreshData: refreshLevel } = useLevels(1, 30);
  const { data: listContractTypes, refreshData: refreshContractType } =
    useContractType(1, 30);
  const { data: listDegreeTypes, refreshData } = useDegreeType(1, 30); // Lấy dữ liệu từ hook
  const { data: listJobTypes, refreshData: refreshJobType } = useJobType(1, 30);
  const { data: listCurrencies, refreshData: refreshMoneyType } = useCurrency(
    1,
    30
  );
  const { t } = useTranslation();
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
    form.setFieldsValue({
      is_negotiable: e.target.checked,
      min_salary: null,
      max_salary: null,
    });
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

  const handleGetSkillByUser = async (params: any) => {
    const newParams = {
      ...params,
      pageSize: 30,
    };
    const res = await EmployerSkillApi.getSkillByUserId(
      userDetail.access_token,
      newParams
    );
    if (res?.data) {
      setListSkills(res?.data.items);
      setMeta(res?.data.meta);
    }
  };

  const [requirements, setRequirements] = useState([]);

  const [newTitle, setNewTitle] = useState("");
  const [newRequirement, setNewRequirement] = useState("");
  const [currentSection, setCurrentSection] = useState("");

  const addRequirement = () => {
    setCurrentSection("");
    if (!newTitle || !newRequirement) {
      message.error(t("error.required"));
      return;
    }

    const newRequirements = [...requirements];

    const targetSection = newRequirements.find(
      (section) => section.title === newTitle.trim()
    );

    if (targetSection) {
      targetSection.items.push(newRequirement);
      setRequirements(newRequirements);
    } else {
      newRequirements.push({ title: newTitle.trim(), items: [newRequirement] });
      setRequirements(newRequirements);
    }

    setNewRequirement("");
    setCurrentSection(newTitle.trim());
  };

  const handleAddNewSection = () => {
    setNewTitle("");
    setNewRequirement("");
  };
  useEffect(() => {
    handleGetSkillByUser({ user_id: userDetail?._id });
  }, []);
  const handleFinishFailed = ({ errorFields }: any) => {
    errorFields.forEach((field: any) => {
      notification.error({
        message: t("notification"),
        description: field.errors[0],
      });
    });
  };
  // SKILLS
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const [selectedSkills, setSelectedSkills] = useState<
    { _id: string; name: string }[]
  >([]);

  const handleSkillChange = (value: any) => {
    const updatedSkills = value
      .map((skillId: string) => {
        const skill = listSkills.find((s) => s._id === skillId);
        return skill ? { _id: skill._id, name: skill.name } : null;
      })
      .filter(Boolean);

    setSelectedSkills(updatedSkills as { _id: string; name: string }[]);
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
      await handleGetSkillByUser({});
      await handleSkillChange(res?.data?._id);
      handleCloseModal();
    } else {
      notification.error({
        message: t("notification"),
        description: t("create_failed"),
      });
    }
  };

  const handleOpenModal = (type: string) => {
    setTypeModal(type);
    setIsModalVisible(true);
  };
  const [formEducation] = Form.useForm();
  const [formLevel] = Form.useForm();
  const [formContractType] = Form.useForm();
  const [formJobType] = Form.useForm();
  const [formMoneyType] = Form.useForm();
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setNewSkill("");
  };
  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      if (!requirements.length) {
        notification.error({
          message: t("notification"),
          description: t("please_enter_skills_and_specialties"),
        });
        return;
      }

      if (!values.general_requirements || !values.general_requirements.length) {
        message.error(t("please_enter_general_requirements"));

        return;
      }
      if (!values.job_responsibilities.length) {
        message.error(t("please_enter_job_responsibilities"));
        return;
      }
      if (!values.interview_process.length) {
        message.error(t("please_enter_interview_process"));
        return;
      }

      const ageRange = { min: values.min_age, max: values.max_age };
      const params = {
        user_id: userDetail?._id,
        title: values.title,
        description: content,
        address: values.address,
        city_id: city,
        district_id: district,
        ward_id: ward,
        age_range: ageRange,
        salary_type: values.salary_type,
        salary_range_min: values.min_salary,
        salary_range_max: values.max_salary,
        job_contract_type: values.job_contract_type,
        benefit: benefitList,
        level: values.level,
        type_money: values.type_money,
        degree: values.degree,
        expire_date: expireDate,
        skills: values.skills?.map((skill: string) => skill?.key),
        is_negotiable: values.is_negotiable,
        count_apply: values.count_apply,
        apply_linkedin: "",
        apply_website: "",
        apply_email: "",
        professional_skills: requirements,
        general_requirements: values.general_requirements,
        job_responsibilities: values.job_responsibilities,
        interview_process: values.interview_process,
        job_type: values.job_type,
        min_experience: +values.min_experience,
        skill_name: values.skills?.map(
          (skill: string) => skill?.label?.props?.children
        ),
        company_name: userDetail?.company_name?.trim(),
      };
      if (values.applicationMethod === "linkedin") {
        params.apply_linkedin = values.applicationLink;
      } else if (values.applicationMethod === "email") {
        params.apply_email = values.applicationLink;
      } else if (values.applicationMethod === "website") {
        params.apply_website = values.applicationLink;
      }
      const res = await JobApi.postJob(params, userDetail.access_token);
      if (res?.data && +res.statusCode === 201) {
        message.success(t("create_success"));
      } else {
        notification.error({
          message: t("notification"),
          description: res.message,
        });
      }
    } catch (error) {
      console.error("errrr", error);
      notification.error({
        message: t("notification"),
        description: error,
      });
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    const { name, description, key } = values;
    const res = await DEGREE_TYPE_API.create(
      { name, description, user_id: userDetail?._id, key },
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      refreshData();
      handleCloseModal();
      formEducation.resetFields();
    } else {
      notification.error({
        message: t("notification"),
        description: t("create_failed"),
      });
    }
  };
  const onFinishLevel = async (values) => {
    const { name, description, key } = values;
    const res = await Level_API.create(
      { name, description, user_id: userDetail?._id, key },
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      refreshLevel();
      handleCloseModal();
      formLevel.resetFields();
    } else {
      notification.error({
        message: t("notification"),
        description: t("create_failed"),
      });
    }
  };
  const onFinishContractType = async (values) => {
    const { name, description, key } = values;
    const res = await JOB_CONTRACT_TYPE_API.create(
      { name, description, user_id: userDetail?._id, key },
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      refreshContractType();
      handleCloseModal();
      formContractType.resetFields();
    } else {
      notification.error({
        message: t("notification"),
        description: t("create_failed"),
      });
    }
  };
  const onFinishJobType = async (values) => {
    const { name, description, key } = values;
    const res = await JOB_TYPE_API.create(
      { name, description, user_id: userDetail?._id, key },
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      refreshJobType();
      handleCloseModal();
      formJobType.resetFields();
    } else {
      notification.error({
        message: t("notification"),
        description: t("create_failed"),
      });
    }
  };
  const onFinishMoneyType = async (values) => {
    const res = await CURRENCY_API.create(
      { user_id: userDetail?._id, ...values },
      userDetail.access_token
    );
    if (res.data) {
      notification.success({
        message: t("notification"),
        description: t("create_success"),
      });
      refreshMoneyType();
      handleCloseModal();
      formMoneyType.resetFields();
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
                className="text-[12px]"
                placeholder={t("enter_skill_name")}
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </Space>
            <div className="flex justify-between items-center mt-10">
              <Button
                className="!text-[12px]"
                key="cancel"
                onClick={handleCloseModal}
              >
                {t("cancel")}
              </Button>
              ,
              <Button
                className="!text-[12px]"
                key="submit"
                type="primary"
                onClick={handleAddNewSkill}
              >
                {t("add_skill")}
              </Button>
            </div>
          </>
        );
      case "add-education":
        return (
          <>
            <Form
              onFinish={onFinish}
              onValuesChange={(changedValues, values) =>
                onValuesChange(changedValues, values, formEducation)
              }
              form={formEducation}
            >
              <Form.Item
                name="name"
                label={t("education_name")}
                rules={[
                  { required: true, message: t("please_enter_education_name") },
                ]}
              >
                <Input placeholder={t("enter_education_name")} />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea
                  placeholder={t("enter_description")}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  {t("save")}
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      case "add-levels":
        return (
          <>
            <Form
              form={formLevel}
              onFinish={onFinishLevel}
              onValuesChange={(changedValues, allValues) =>
                onValuesChange(changedValues, allValues, formLevel)
              } // Hàm theo dõi thay đổi giá trị
              layout="vertical"
            >
              <Form.Item
                name="name"
                label={t("level_name")}
                rules={[
                  { required: true, message: t("please_enter_level_name") },
                ]}
              >
                <Input placeholder={t("enter_level_name")} />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item name="description" label={t("description")}>
                <Input.TextArea
                  placeholder={t("enter_description")}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  {t("save")}
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      case "add_job_contract_type":
        return (
          <>
            <Form
              form={formContractType}
              onFinish={onFinishContractType}
              onValuesChange={(changedValues, allValues) =>
                onValuesChange(changedValues, allValues, formContractType)
              } // Hàm theo dõi thay đổi giá trị
              layout="vertical"
            >
              <Form.Item
                name="name"
                label={t("job_contract_type_name")}
                rules={[
                  {
                    required: true,
                    message: t("please_enter_job_contract_type_name"),
                  },
                ]}
              >
                <Input placeholder={t("enter_job_contract_type_name")} />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea
                  placeholder={t("enter_description")}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  {t("save")}
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      case "add_job_type":
        return (
          <>
            <Form
              form={formJobType}
              onFinish={onFinishJobType}
              onValuesChange={(changedValues, allValues) =>
                onValuesChange(changedValues, allValues, formJobType)
              } // Hàm theo dõi thay đổi giá trị
              layout="vertical"
            >
              <Form.Item
                name="name"
                label={t("job_type_name")}
                rules={[
                  {
                    required: true,
                    message: t("please_enter_job_type_name"),
                  },
                ]}
              >
                <Input placeholder={t("enter_job_type_name")} />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item name="description" label={t("description")}>
                <Input.TextArea
                  placeholder={t("enter_description")}
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  {t("save")}
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      case "add-money-type":
        return (
          <>
            <Form
              form={formMoneyType}
              onFinish={onFinishMoneyType}
              onValuesChange={(changedValues, allValues) =>
                onValuesChange(changedValues, allValues, formMoneyType)
              } // Hàm theo dõi thay đổi giá trị
              layout="vertical"
            >
              <Form.Item
                name="name"
                label={t("money_type_name")}
                rules={[
                  {
                    required: true,
                    message: t("please_enter_money_type_name"),
                  },
                ]}
              >
                <Input placeholder={t("enter_money_type_name")} />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="symbol"
                label={t("symbol")}
                rules={[{ required: true, message: t("please_enter_symbol") }]}
              >
                <Input placeholder={t("enter_symbol")} />
              </Form.Item>

              <Form.Item
                name="code"
                label={t("code")}
                rules={[{ required: true, message: t("please_enter_code") }]}
              >
                <Input placeholder={t("enter_code")} />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  {t("save")}
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      default:
        break;
    }
  };
  const removeVietnameseTones = (str) => {
    return str
      .normalize("NFD") // Chuẩn hóa chuỗi, tách các ký tự có dấu
      .replace(/[\u0300-\u036f]/g, "") // Xóa các dấu
      .replace(/đ/g, "d") // Chuyển 'đ' thành 'd'
      .replace(/Đ/g, "D"); // Chuyển 'Đ' thành 'D'
  };

  const onValuesChange = (changedValues, allValues, formField) => {
    if (changedValues.name) {
      // Loại bỏ dấu tiếng Việt, chuyển thành chữ thường và thay khoảng trắng bằng dấu gạch dưới
      const key = removeVietnameseTones(changedValues.name)
        .toLowerCase()
        .replace(/\s+/g, "_"); // Thay thế khoảng trắng bằng dấu gạch dưới
      formField?.setFieldsValue({
        key: key,
      });
    }
  };
  const [currencySymbol, setCurrencySymbol] = useState("USD");
  const handleCurrencyChange = (value) => {
    const selectedCurrency = listCurrencies.find(
      (currency) => currency._id === value
    );
    if (selectedCurrency) {
      setCurrencySymbol(selectedCurrency.code);
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
          handleSubmit(values);
        }}
      >
        {/* Job Title */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[20px] font-semibold mb-4">{t("post_job")}</h2>

          <Form.Item
            label={<div className="text-[12px]">{t("job_title")}</div>}
            name="title"
            rules={[{ required: true, message: t("please_enter_job_title") }]}
          >
            <Input placeholder={t("enter_job_title")} className="text-[12px]" />
          </Form.Item>
        </div>

        {/* Salary */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[20px] font-semibold mb-4">{t("salary")}</h2>

          <div className="flex justify-between flex-col">
            {/* Negotiable Salary Checkbox */}
            <Form.Item name="is_negotiable" valuePropName="checked">
              <Checkbox
                onChange={handleNegotiableChange}
                className="text-[12px]"
              >
                {t("negotiable_salary")}
              </Checkbox>
            </Form.Item>

            {/* Salary Type */}
            <Form.Item
              label={<div className="text-[12px]">{t("money_type")}</div>}
              name="type_money"
              className="lg:w-[300px] w-full text-[12px]"
              rules={[
                { required: true, message: t("please_enter_money_type") },
              ]}
            >
              <Select
                placeholder={t("choose_money_type")}
                onChange={handleCurrencyChange}
                className="!text-[12px]"
              >
                {listCurrencies.map((currency) => {
                  return (
                    <Select.Option value={currency._id}>
                      <div className="text-[12px]">{currency.code}</div>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
            <Form.Item
              label={<div className="!text-[12px]">{t("salary_type")}</div>}
              name="salary_type"
              className="lg:w-[300px] w-full !text-[12px]"
              rules={[
                {
                  required: true,
                  message: t("please_enter_salary_type"),
                },
              ]}
            >
              <Select
                placeholder={t("choose_salary_type")}
                className="!text-[12px]"
              >
                <Select.Option value="yearly">
                  <span className="text-[12px]">{t("monthly")}</span>
                </Select.Option>
                <Select.Option value="monthly">
                  <span className="text-[12px]">{t("yearly")}</span>
                </Select.Option>
                <Select.Option value="hourly">
                  <span className="text-[12px]">{t("hourly")}</span>
                </Select.Option>
              </Select>
            </Form.Item>
            {/* Min Salary */}
            <Form.Item
              label={<div className="text-[12px]">{t("min_salary")}</div>}
              name="min_salary"
              rules={[
                {
                  required: !isNegotiable,
                  message: t("please_enter_min_salary"),
                },
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined size={12} />}
                className="lg:w-[300px] w-full !text-[12px]"
                placeholder={t("enter_min_salary")}
                addonAfter={currencySymbol}
                disabled={isNegotiable}
              />
            </Form.Item>

            {/* Max Salary */}
            <Form.Item
              label={<div className="text-[12px]">{t("max_salary")}</div>}
              name="max_salary"
              rules={[
                {
                  required: !isNegotiable,
                  message: t("please_enter_max_salary"),
                },
              ]}
              className="!text-[12px]"
            >
              <InputNumber
                prefix={<DollarOutlined />}
                className="lg:w-[300px] w-full !text-[12px]"
                placeholder={t("enter_max_salary")}
                addonAfter={currencySymbol}
                disabled={isNegotiable}
              />
            </Form.Item>
          </div>
        </div>
        <section className="p-6 bg-white rounded-lg shadow-md mb-4">
          <Title level={5} className="text-xl font-semibold">
            <span className="text-red-500 text-[20px]">*</span>{" "}
            {t("skills_and_specialties")}
          </Title>

          <div className="space-y-6">
            {requirements.map((section, index) => (
              <div key={index}>
                <Text strong className="text-[14px]">
                  - {section.title}
                </Text>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="text-gray-700 text-[12px]">
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
                  placeholder={t("enter_main_title")}
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="shadow-sm rounded-md border-gray-300 text-[12px]"
                />
                <Input
                  placeholder={t("enter_requirement")}
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="shadow-sm rounded-md border-gray-300 text-[12px]"
                />
                <Button
                  type="primary"
                  onClick={addRequirement}
                  className="w-full py-2 mt-4 !text-[12px]"
                >
                  {t("add_requirement")}
                </Button>
              </Space>
            </div>

            {/* Hiển thị tựa đề hiện tại mà người dùng đang chỉnh sửa */}
            {currentSection && (
              <div className="mt-4 text-gray-600">
                <Text className="!text-[12px]" strong>
                  {t("editing_section")}: {currentSection}
                </Text>
              </div>
            )}

            {/* Nút để thêm tựa đề mới */}
            {newTitle && (
              <Button
                type="default"
                onClick={handleAddNewSection}
                className="mt-4 w-full py-2 !text-[12px]"
              >
                {t("add_section")}
              </Button>
            )}
          </div>
        </section>

        {/* Advanced Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[20px] font-semibold mb-4">
            {t("advanced_information")}
          </h2>
          <Form.Item
            name="min_age"
            label={<div className="text-[12px]">{t("min_age")}</div>}
            rules={[
              {
                required: true,
                message: t("please_enter_min_age"),
              },
              {
                type: "number",
                min: 18,
                max: 65,
                message: t("please_enter_min_age"),
              },
            ]}
          >
            <InputNumber
              min={18}
              max={65}
              placeholder={t("enter_min_age")}
              className="text-[12px] w-auto"
            />
          </Form.Item>

          <Form.Item
            name="max_age"
            label={<div className="text-[12px]">{t("max_age")}</div>}
            rules={[
              {
                required: true,
                message: t("please_enter_max_age"),
              },
              {
                type: "number",
                min: 18,
                max: 65,
                message: t("min_age_must_be_between_18_and_65"),
              },
            ]}
          >
            <InputNumber
              min={18}
              max={65}
              placeholder={t("enter_max_age")}
              className="text-[12px] w-auto"
            />
          </Form.Item>
          <div className="">
            <Form.Item
              label={<div className="text-[12px]">{t("skills_required")}</div>}
              name="skills"
              rules={[
                {
                  required: true,
                  message: t("please_enter_skills_required"),
                },
              ]}
            >
              <Select
                placeholder={t("choose_skills_required")}
                mode="multiple"
                style={{ width: "100%", fontSize: "12px" }}
                value={selectedSkills.map((skill) => ({
                  key: skill._id,
                  label: skill.name,
                }))}
                onChange={handleSkillChange}
                labelInValue
              >
                {listSkills.map((skill) => (
                  <Select.Option key={skill._id} value={skill._id}>
                    <div className="text-[12px]">{skill?.name}</div>
                  </Select.Option>
                ))}

                {/* Hiển thị dấu + nếu chưa có kỹ năng nào được chọn */}
                <Select.Option key="add-skill" value="add-skill" disabled>
                  <Button
                    type="dashed"
                    icon={<PlusOutlined />}
                    onClick={() => handleOpenModal("add-skill")}
                    style={{ width: "100%", fontSize: "12px" }}
                  >
                    {t("add_skill")}
                  </Button>
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("degree")}</div>}
              name="degree"
              rules={[
                {
                  required: true,
                  message: t("please_enter_degree"),
                },
              ]}
            >
              <Select placeholder="Select" className="w-full text-[12px]">
                {listDegreeTypes.map((degree) => (
                  <Select.Option key={degree._id} value={degree._id}>
                    <span className="text-[12px]">{degree.name}</span>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("level")}</div>}
              name="level"
              rules={[
                {
                  required: true,
                  message: t("please_enter_level"),
                },
              ]}
            >
              <Select placeholder="Select">
                {listLevels.map((level, idx) => {
                  return (
                    <Select.Option key={idx} value={level._id}>
                      <span className="text-[12px]">{level.name}</span>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>

            {/* Yêu cầu chung */}
            <Form.List name="general_requirements">
              {(fields, { add, remove }) => (
                <>
                  <label className="text-[12px]">
                    <span className="text-red-500 mr-1">*</span>
                    {t("general_requirements")}
                  </label>
                  {fields.map((field) => (
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
                        <Input
                          placeholder={t("enter_general_requirements")}
                          className="text-[12px]"
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      className="!text-[12px]"
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
                  <label className="text-[12px]">
                    <span className="text-red-500 mr-1">*</span>
                    {t("job_responsibilities")}
                  </label>
                  {fields.map((field) => (
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
                        <Input
                          placeholder={t("enter_job_responsibilities")}
                          className="text-[12px]"
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      className="!text-[12px]"
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

            {/* Quy trình phỏng vấn */}
            <Form.List name="interview_process">
              {(fields, { add, remove }) => (
                <>
                  <label className="text-[12px]">
                    <span className="text-red-500 mr-1">*</span>
                    {t("interview_process")}
                  </label>
                  {fields.map((field) => (
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
                        <Input
                          placeholder={t("enter_interview_process")}
                          className="text-[12px]"
                        />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      className="!text-[12px]"
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
              label={
                <div className="text-[12px]">{t("job_contract_type")}</div>
              }
              name="job_contract_type"
              rules={[
                {
                  required: true,
                  message: t("please_enter_job_contract_type"),
                },
              ]}
            >
              <Select
                placeholder={t("choose_job_contract_type")}
                className="!text-[12px]"
              >
                {listContractTypes.map((type, idx) => {
                  return (
                    <Select.Option key={idx} value={type._id}>
                      <span className="text-[12px]">{type.name}</span>
                    </Select.Option>
                  );
                })}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label={<div className="text-[12px]">{t("count_apply")}</div>}
              name="count_apply"
              rules={[
                {
                  required: true,
                  message: t("please_enter_count_apply"),
                },
              ]}
            >
              <InputNumber
                className="w-full text-[12px]"
                placeholder={t("enter_count_apply")}
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">{t("expire_date")}</div>}
              name="expire_date"
              rules={[
                { required: true, message: t("please_enter_expire_date") },
              ]}
            >
              <DatePicker
                type="date"
                value={expireDate}
                onChange={(date) => {
                  setExpireDate(date);
                }}
                className="text-[12px]"
              />
            </Form.Item>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[20px] font-semibold mb-4">{t("location")}</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Field */}
            <Form.Item
              label={<div className="text-[12px]">{t("city")}</div>}
              name="city"
              rules={[
                {
                  required: true,
                  message: t("please_enter_city"),
                },
              ]}
            >
              <Select
                className="text-[12px]"
                placeholder={t("choose_city")}
                value={city}
                onChange={handleCityChange}
                loading={citiesLoading}
              >
                {/* Render city options dynamically from the hook */}
                {cities.map((cityItem) => (
                  <Select.Option key={cityItem._id} value={cityItem._id}>
                    <span className="text-[12px]">{cityItem.name}</span>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* District Field */}
            <Form.Item
              label={<div className="text-[12px]">{t("district")}</div>}
              name="district"
              rules={[
                {
                  required: true,
                  message: t("please_enter_district"),
                },
              ]}
            >
              <Select
                className="text-[12px]"
                placeholder={t("choose_district")}
                value={district}
                onChange={handleDistrictChange}
                loading={districtLoading}
              >
                {districts.map((district) => (
                  <Select.Option key={district._id} value={district._id}>
                    <span className="text-[12px]">{district.name}</span>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ward Field */}
            <Form.Item
              label={<div className="text-[12px]">{t("ward")}</div>}
              name="ward"
              rules={[{ required: true, message: t("please_enter_ward") }]}
            >
              <Select
                placeholder={t("choose_ward")}
                value={ward}
                onChange={handleWardChange}
                loading={wardsLoading}
              >
                {wards.map((ward) => (
                  <Select.Option key={ward._id} value={ward._id}>
                    <span className="text-[12px]">{ward.name}</span>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            {/* Address Field */}
            <Form.Item
              label={<div className="text-[12px]">{t("address")}</div>}
              name="address"
            >
              <Input
                placeholder={t("please_enter_address")}
                className="text-[12px]"
              />
            </Form.Item>
          </div>
        </div>

        {/* Job Benefits */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[20px] font-semibold mb-4">
            {t("job_benefits")}
          </h2>

          <Form.Item
            label={<div className="text-[12px]">{t("job_benefits")}</div>}
            rules={[
              { required: true, message: t("please_enter_job_benefits") },
            ]}
          >
            <Input
              className="text-[12px]"
              placeholder={t("job_benefits_placeholder")}
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onPressEnter={handleAddBenefit}
            />
            <Button
              type="primary"
              onClick={handleAddBenefit}
              className="mt-2 !text-[12px]"
            >
              {t("add_job_benefits")}
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
            label={<div className="text-[12px]">{t("min_experience")}</div>}
            rules={[
              {
                required: true,
                message: t("please_enter_min_experience"),
              },
            ]}
          >
            <InputNumber defaultValue={1} className="text-[12px]" />
          </Form.Item>

          {/* Thêm trường Loại hình công việc */}
          <Form.Item
            name="job_type"
            label={<div className="text-[12px]">{t("job_type")}</div>}
            rules={[
              {
                required: true,
                message: t("please_enter_job_type"),
              },
            ]}
          >
            <Select placeholder={t("choose_job_type")} className="!text-[12px]">
              {listJobTypes.map((jobType) => {
                return (
                  <Select.Option key={jobType.key} value={jobType._id}>
                    <span className="text-[12px]">{jobType.name}</span>
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
        </div>

        {/* Job Mô tả */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[20px] font-semibold mb-4">
            {t("job_description")}
          </h2>
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
          <h2 className="text-[20px] font-semibold mb-4">
            {t("application_method")}
          </h2>

          <Form.Item
            name="applicationMethod"
            rules={[
              {
                required: true,
                message: t("please_enter_application_method"),
              },
            ]}
          >
            <Radio.Group>
              <Radio className="text-[12px]" value="linkedin">
                {t("linkedin")}
              </Radio>
              <Radio className="text-[12px]" value="company">
                {t("company_website")}
              </Radio>
              <Radio className="text-[12px]" value="email">
                {t("email")}
              </Radio>
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
            <Input
              placeholder={t("please_enter_application_link")}
              className="text-[12px]"
            />
          </Form.Item>
        </div>

        {/* Image Company s */}
        {/* Submit Button */}
        <LoadingComponent isLoading={loading}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full !text-[12px]"
            >
              {t("save")}
            </Button>
          </Form.Item>
        </LoadingComponent>
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
