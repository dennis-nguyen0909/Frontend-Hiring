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
  const [typeModal, setTypeModal] = useState<string>("");
  const [expireDate, setExpireDate] = useState("");
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
  const [currentSection, setCurrentSection] = useState(""); // Để theo dõi phần tựa đề hiện tại

  // Thêm yêu cầu vào đúng tựa đề
  const addRequirement = () => {
    setCurrentSection("");
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
    handleGetSkillByUser({ user_id: userDetail?._id });
  }, []);
  const handleFinishFailed = ({ errorFields }: any) => {
    errorFields.forEach((field: any) => {
      notification.error({
        message: "Thông báo",
        description: field.errors[0], // Display the first validation error for each field
      });
    });
  };
  // SKILLS
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  const handleSkillChange = (value: string) => {
    setSelectedSkills(value);
  };

  const handleAddNewSkill = async () => {
    const res = await EmployerSkillApi.postSkill(
      { name: newSkill, user_id: userDetail?._id },
      userDetail.access_token
    );
    if (res.data) {
      console.log("duydeptrai", res.data);
      notification.success({
        message: "Thông báo",
        description: "Thêm thành công",
      });
      await handleGetSkillByUser({});
      handleSkillChange(res?.data?._id);
      handleCloseModal();
    } else {
      notification.error({
        message: "Thông báo",
        description: "Thêm thất bại",
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
          message: "Thông báo",
          description: "Vui lòng nhập kỹ năng và chuyên môn",
        });
        return;
      }

      if (!values.general_requirements || !values.general_requirements.length) {
        message.error("Vui lòng nhập yêu cầu chung");

        // notification.error({
        //   message: "Thông báo",
        //   description: "Vui lòng nhập yêu cầu chung",
        // });
        return;
      }
      if (!values.job_responsibilities.length) {
        message.error("Vui lòng nhập trách nhiệm công việc");
        // notification.error({
        //   message: "Thông báo",
        //   description: "Vui lòng nhập trách nhiệm công việc",
        // });
        return;
      }
      if (!values.interview_process.length) {
        message.error("Vui lòng nhập quy trình phỏng vấn");

        // notification.error({
        //   message: "Thông báo",
        //   description: "Vui lòng nhập quy trình phỏng vấn",
        // });
        return;
      }
      const salaryRange = { min: values.min_salary, max: values.max_salary };
      const ageRange = { min: values.min_age, max: values.max_age };
      let params = {
        user_id: userDetail?._id,
        title: values.title,
        description: content,
        address: values.address,
        city_id: city,
        district_id: district,
        ward_id: ward,
        salary_range: salaryRange,
        age_range: ageRange,
        salary_type: values.salary_type,
        job_contract_type: values.job_contract_type,
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
        job_type: values.job_type,
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
      if (res?.data && +res.statusCode === 201) {
        message.success("Tạo thành công");
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
      console.error("errrr", error);
      notification.error({
        message: "Thông báo",
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
        message: "Thông báo",
        description: "Thêm thành công",
      });
      refreshData();
      handleCloseModal();
      formEducation.resetFields();
    } else {
      notification.error({
        message: "Thông báo",
        description: "Thêm thất bại",
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
        message: "Thông báo",
        description: "Thêm thành công",
      });
      refreshLevel();
      handleCloseModal();
      formLevel.resetFields();
    } else {
      notification.error({
        message: "Thông báo",
        description: "Thêm thất bại",
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
        message: "Thông báo",
        description: "Thêm thành công",
      });
      refreshContractType();
      handleCloseModal();
      formContractType.resetFields();
    } else {
      notification.error({
        message: "Thông báo",
        description: "Thêm thất bại",
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
        message: "Thông báo",
        description: "Thêm thành công",
      });
      refreshJobType();
      handleCloseModal();
      formJobType.resetFields();
    } else {
      notification.error({
        message: "Thông báo",
        description: "Thêm thất bại",
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
        message: "Thông báo",
        description: "Thêm thành công",
      });
      refreshMoneyType();
      handleCloseModal();
      formMoneyType.resetFields();
    } else {
      notification.error({
        message: "Thông báo",
        description: "Thêm thất bại",
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
                placeholder="Nhập tên kỹ năng"
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
                Hủy
              </Button>
              ,
              <Button
                className="!text-[12px]"
                key="submit"
                type="primary"
                onClick={handleAddNewSkill}
              >
                Thêm kỹ năng
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
                label="Tên giáo dục"
                rules={[
                  { required: true, message: "Vui lòng nhập tên cấp độ!" },
                ]}
              >
                <Input placeholder="Nhập tên ..." />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea
                  placeholder="Nhập mô tả.."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  Lưu
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
                label="Tên cấp độ"
                rules={[
                  { required: true, message: "Vui lòng nhập tên cấp độ!" },
                ]}
              >
                <Input placeholder="Nhập tên ..." />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea
                  placeholder="Nhập mô tả.."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  Lưu
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
                label="Tên loại hợp đồng"
                rules={[
                  { required: true, message: "Vui lòng nhập tên cấp độ!" },
                ]}
              >
                <Input placeholder="Nhập tên ..." />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea
                  placeholder="Nhập mô tả.."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  Lưu
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
                label="Tên loại hình làm việc"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập loại hình làm việc!",
                  },
                ]}
              >
                <Input placeholder="Nhập tên ..." />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea
                  placeholder="Nhập mô tả.."
                  autoSize={{ minRows: 3, maxRows: 6 }}
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  Lưu
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
                label="Tên loại tiền tệ"
                rules={[
                  { required: true, message: "Vui lòng nhập tên loại tiền tệ" },
                ]}
              >
                <Input placeholder="Ví dụ: Việt nam đồng" />
              </Form.Item>

              <Form.Item name="key" label="Key">
                <Input disabled />
              </Form.Item>

              <Form.Item
                name="symbol"
                label="Ký hiệu"
                rules={[{ required: true, message: "Vui lòng nhập ký hiệu!" }]}
              >
                <Input placeholder="Ví dụ: $, đ..." />
              </Form.Item>

              <Form.Item
                name="code"
                label="Code"
                rules={[{ required: true, message: "Vui lòng nhập code!" }]}
              >
                <Input placeholder="Ví dụ: USD, VND..." />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full !bg-primaryColor"
                >
                  Lưu
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
    const selectedCurrency = listCurrencies.find(currency => currency._id === value);
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
          <h2 className="text-[16px] font-semibold mb-4">Đăng công việc</h2>

          <Form.Item
            label={<div className="text-[12px]">Tiêu đề</div>}
            name="title"
            rules={[
              { required: true, message: "Tiêu đề công việc là bắt buộc" },
            ]}
          >
            <Input
              placeholder="Thêm tiêu đề công việc ..."
              className="text-[12px]"
            />
          </Form.Item>
        </div>

        {/* Salary */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[16px] font-semibold mb-4">Lương</h2>

          <div className="flex justify-between flex-col">
            {/* Negotiable Salary Checkbox */}
            <Form.Item name="is_negotiable" valuePropName="checked">
              <Checkbox
                onChange={handleNegotiableChange}
                className="text-[12px]"
              >
                Lương thỏa thuận
              </Checkbox>
            </Form.Item>

            {/* Salary Type */}
            <Form.Item
              label={<div className="text-[12px]">Loại tiền</div>}
              name="type_money"
              className="lg:w-[300px] w-full text-[12px]"
              rules={[{ required: true, message: "Vui lòng chọn loại tiền!" }]}
            >
              <Select placeholder="Chọn loại tiền"  onChange={handleCurrencyChange} className="!text-[12px]">
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
              label={<div className="!text-[12px]">Loại trả lương</div>}
              name="salary_type"
              className="lg:w-[300px] w-full !text-[12px]"
              rules={[
                {
                  required: !isNegotiable,
                  message: "Vui lòng chọn loại trả lương",
                },
              ]}
            >
              <Select
                placeholder="Chọn loại trả lương"
                 className="!text-[12px]"
                disabled={isNegotiable}
              >
                <Select.Option clas value="yearly">
                  <span className="text-[12px]">Theo tháng</span>
                </Select.Option>
                <Select.Option value="monthly">
                  <span className="text-[12px]">Theo năm</span>
                </Select.Option>
                <Select.Option value="hourly">
                  <span className="text-[12px]">Theo giờ</span>
                </Select.Option>
              </Select>
            </Form.Item>
             {/* Min Salary */}
             <Form.Item
              label={<div className="text-[12px]">Mức lương tối thiểu</div>}
              name="min_salary"
              rules={[
                {
                  required: !isNegotiable,
                  message: "Vui lòng nhập lương tối thiểu!",
                },
              ]}
            >
              <InputNumber
                prefix={<DollarOutlined size={12} />}
                className="lg:w-[300px] w-full !text-[12px]"
                placeholder="Lương tối thiểu..."
                  addonAfter={currencySymbol}
                disabled={isNegotiable}
              />
            </Form.Item>

            {/* Max Salary */}
            <Form.Item
              label={<div className="text-[12px]">Mức lương tối đa</div>}
              name="max_salary"
              rules={[
                {
                  required: !isNegotiable,
                  message: "Vui lòng nhập lương tối đa!",
                },
              ]}
              className="!text-[12px]"
            >
              <InputNumber
                prefix={<DollarOutlined />}
                className="lg:w-[300px] w-full !text-[12px]"
                placeholder="Lương tối đa..."
                  addonAfter={currencySymbol}
                disabled={isNegotiable}
              />
            </Form.Item>
          </div>
        </div>
        <section className="p-6 bg-white rounded-lg shadow-md mb-4">
          <Title level={5} className="text-xl font-semibold">
            <span className="text-red-500 text-[16px]">*</span> Kỹ năng & Chuyên
            môn
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
                  placeholder="Nhập tựa đề (ví dụ: 2 năm kinh nghiệm)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="shadow-sm rounded-md border-gray-300 text-[12px]"
                />
                <Input
                  placeholder="Nhập yêu cầu"
                  value={newRequirement}
                  onChange={(e) => setNewRequirement(e.target.value)}
                  className="shadow-sm rounded-md border-gray-300 text-[12px]"
                />
                <Button
                  type="primary"
                  onClick={addRequirement}
                  className="w-full py-2 mt-4 !text-[12px]"
                >
                  Thêm yêu cầu
                </Button>
              </Space>
            </div>

            {/* Hiển thị tựa đề hiện tại mà người dùng đang chỉnh sửa */}
            {currentSection && (
              <div className="mt-4 text-gray-600">
                <Text className="!text-[12px]" strong>
                  Đang chỉnh sửa phần: {currentSection}
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
                Thêm tựa đề mới
              </Button>
            )}
          </div>
        </section>

        {/* Advanced Information */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[16px] font-semibold mb-4">Thông tin nâng cao</h2>
          <Form.Item
            name="min_age"
            label={<div className="text-[12px]">Tuổi tối thiểu</div>}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tuổi tối thiểu!",
              },
              {
                type: "number",
                min: 18,
                max: 65,
                message: "Tuổi phải từ 18 đến 65!",
              },
            ]}
          >
            <InputNumber
              min={18}
              max={65}
              placeholder="Tuổi tối thiểu"
              className="text-[12px] w-auto"
            />
          </Form.Item>

          <Form.Item
            name="max_age"
            label={<div className="text-[12px]">Tuổi tối đa</div>}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập tuổi tối đa!",
              },
              {
                type: "number",
                min: 18,
                max: 65,
                message: "Tuổi phải từ 18 đến 65",
              },
            ]}
          >
            <InputNumber
              min={18}
              max={65}
              placeholder="Tuổi tối đa"
              className="text-[12px] w-auto"
            />
          </Form.Item>
          <div className="">
            <Form.Item
              label={<div className="text-[12px]">Kỹ năng yêu cầu</div>}
              name="skills"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn kỹ năng yêu cầu!",
                },
              ]}
            >
              <Select
                placeholder="Chọn kỹ năng"
                mode="multiple"
                style={{ width: "100%", fontSize: "12px" }}
                value={selectedSkills}
                onChange={handleSkillChange}
              >
                {listSkills.map((skill) => (
                  <Select.Option key={skill._id} value={skill._id}>
                    <div className="text-[12px]">{skill.name}</div>
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
                    Thêm kỹ năng mới
                  </Button>
                </Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Giáo dục</div>}
              name="degree"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn trình độ giáo dục!",
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
              label={<div className="text-[12px]">Cấp độ yêu cầu</div>}
              name="level"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn cấp độ yêu cầu!",
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
                    Yêu cầu chung
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
                            message: "Vui lòng nhập yêu cầu chung!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Yêu cầu chung"
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
                      Thêm yêu cầu
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
                    Trách nhiệm công việc
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
                            message: "Vui lòng nhập trách nhiệm công việc!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Trách nhiệm công việc"
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
                      Thêm trách nhiệm công việc
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
                            message: "Vui lòng nhập quy trình phỏng vấn!",
                          },
                        ]}
                      >
                        <Input
                          placeholder="Quy trình phỏng vấn"
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
                      Thêm quy trình phỏng vấn
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
            <Form.Item
              label={<div className="text-[12px]">Loại hợp đồng</div>}
              name="job_contract_type"
              rules={[
                { required: true, message: "Vui lòng chọn loại hợp đồng!" },
              ]}
            >
              <Select placeholder="Chọn loại hợp đồng" className="!text-[12px]">
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
              label={<div className="text-[12px]">Số lượng tuyển</div>}
              name="count_apply"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số lượng tuyển!",
                },
              ]}
            >
              <InputNumber
                className="w-full text-[12px]"
                placeholder="Số lượng cho vị trí tuyển.."
              />
            </Form.Item>

            <Form.Item
              label={<div className="text-[12px]">Ngày hết hạn</div>}
              name="expire_date"
              rules={[
                { required: true, message: "Vui lòng chọn ngày hết hạn!" },
              ]}
            >
              <Input
                type="date"
                onChange={(e) => setExpireDate(e.target.value)}
                className="text-[12px]"
              />
            </Form.Item>
          </div>
        </div>

        {/* Location */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[16px] font-semibold mb-4">Vị trí làm việc</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* City Field */}
            <Form.Item
              label={<div className="text-[12px]">Thành phố / tỉnh</div>}
              name="city"
              rules={[{ required: true, message: "Vui lòng chọn thành phố / tỉnh!" }]}
            >
              <Select
                className="text-[12px]"
                placeholder="Chọn thành phố / tỉnh"
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
              label={<div className="text-[12px]">Quận / huyện</div>}
              name="district"
              rules={[{ required: true, message: "Vui lòng chọn quận / huyện!" }]}
            >
              <Select
                className="text-[12px]"
                placeholder="Chọn quận / huyện"
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
              label={<div className="text-[12px]">Xã / phường</div>}
              name="ward"
              rules={[{ required: true, message: "Vui lòng chọn xã / phường!" }]}
            >
              <Select
                placeholder="Chọn xã..."
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
            <Form.Item label={<div className="text-[12px]">Địa chỉ</div>} name="address">
              <Input placeholder="Vui lòng nhập địa chỉ" className="text-[12px]" />
            </Form.Item>
          </div>

          {/* <Form.Item name="isRemote" valuePropName="checked">
            <Checkbox className="text-[12px]">Fully Remote Position / Worldwide</Checkbox>
          </Form.Item> */}
        </div>

        {/* Job Benefits */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h2 className="text-[16px] font-semibold mb-4">
            Phúc lợi cho ứng viên
          </h2>

          <Form.Item
            label={<div className="text-[12px]">Phúc lợi</div>}
            rules={[
              { required: true, message: "Vui lòng chọn ít nhất 1 lợi ích!" },
            ]}
          >
            <Input
            className="text-[12px]"
              placeholder="Vui lòng nhập phúc lợi cho ứng viên"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              onPressEnter={handleAddBenefit}
            />
            <Button type="primary" onClick={handleAddBenefit} className="mt-2 !text-[12px]">
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
            label={<div className="text-[12px]">Kinh nghiệm tối thiểu ( Năm )</div>}
            rules={[
              {
                required: true,
                message: "Vui lòng nhập kinh nghiệm tối thiểu!",
              },
            ]}
          >
            <InputNumber min={1} placeholder="1" defaultValue={1}  className="text-[12px]"/>
          </Form.Item>

          {/* Thêm trường Loại hình công việc */}
          <Form.Item
            name="job_type"
            label={
              <div  className="text-[12px]">Loại hình làm việc</div>
            }
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại hình làm việc!",
              },
            ]}
          >
            <Select placeholder="Chọn loại hình"  className="!text-[12px]">
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
          <h2 className="text-[16px] font-semibold mb-4">Mô tả công việc</h2>
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
          <h2 className="text-[16px] font-semibold mb-4">
            Ứng tuyển công việc trên
          </h2>

          <Form.Item
            name="applicationMethod"
            rules={[
              {
                required: true,
                message: "Vui lòng chọn loại nộp đơn xin việc!",
              },
            ]}
          >
            <Radio.Group>
              <Radio className="text-[12px]" value="linkedin">LinkedIn</Radio>
              <Radio className="text-[12px]" value="company">Company website</Radio>
              <Radio className="text-[12px]" value="email">Email</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="applicationLink"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập liên kết đơn ứng tuyển!",
              },
            ]}
          >
            <Input placeholder="Vui lòng nhập URL hoặc Email"  className="text-[12px]" />
          </Form.Item>
        </div>

        {/* Image Company s */}
        {/* Submit Button */}
        <LoadingComponent isLoading={loading}>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full !text-[12px]">
              Lưu
            </Button>
          </Form.Item>
        </LoadingComponent>
      </Form>
      <GeneralModal
        title="Thêm"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        renderBody={() => renderBody(typeModal)}
        // footer={false}
      />
    </div>
  );
}
