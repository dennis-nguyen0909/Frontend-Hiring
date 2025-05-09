import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Image,
  Input,
  notification,
  Form,
  Card,
  Avatar,
} from "antd";
import logo from "../../assets/images/logo.png";
import icon from "../../assets/logo/LogoH.png";
import { EyeFilled, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as authServices from "../../services/modules/authServices";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import { itemsIcon } from "../../helper";
import facebook from "../../assets/icons/fb.png";
import google from "../../assets/icons/gg.png";
import { useSelector } from "react-redux";
import { Building, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../../components/LanguagesSwitch/LanguagesSwitch";
const LoginPage = () => {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [role, setRole] = useState<string>("USER");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const user = useSelector((state: any) => state.user);
  const [selectedType, setSelectedType] = useState<"user" | "employer" | null>(
    null
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (selectedType) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [selectedType]);

  const handleTypeSelect = (type: "user" | "employer") => {
    setSelectedType(type);
  };
  useEffect(() => {
    if (user?.access_token) {
      navigate("/");
    }
  }, [user?.access_token]);

  const handleNextRegister = () => {
    navigate("/login");
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsLoading(true);
      const { fullName, username, email, password } = values;
      const role = selectedType?.toUpperCase();
      const res = await authServices.register({
        full_name: fullName,
        username,
        email,
        password,
        role,
      });
      if (res.data) {
        notification.success({
          message: t("notification_success"),
          description: t("register_success"),
        });
        navigate("/verify", {
          state: {
            email: email,
            userId: res.data.user_id,
          },
        });
      }
      if (+res.error_code === 400) {
        notification.error({
          message: t("notification_error"),
          description: res?.message,
        });
      }
    } catch (error) {
      notification.error({
        message: t("notification_error"),
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderFormCreate = () => {
    return (
      <Form
        className="w-full max-w-[500px] mt-5 mx-4 lg:mx-10"
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ role }}
      >
        {/* header */}
        <div className="flex items-center lg:justify-start justify-center gap-2">
          <Avatar shape="square" src={icon} />
          <h1
            onClick={() => navigate("/")}
            className="font-medium text-2xl cursor-pointer"
          >
            HireDev
          </h1>
        </div>

        <Card className="bg-gray-50 border-0 mt-10">
          <h2 className="text-center text-gray-500 text-[20px] mb-4">
            {t("create_account_as_a")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              className={`p-2 bg-white rounded-lg border cursor-pointer flex items-center gap-3 ${
                selectedType === "user"
                  ? "ring-2 ring-blue-500"
                  : "hover:bg-gray-50"
              }`}
              style={{
                transform:
                  isTransitioning && selectedType === "user"
                    ? "scale(1.05)"
                    : "scale(1)",
                opacity: isTransitioning && selectedType !== "user" ? 0.5 : 1,
                transition:
                  "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
              }}
              onClick={() => handleTypeSelect("user")}
            >
              <User className="w-6 h-6 text-gray-600" />
              <span className=" text-gray-600 text-[12px]">
                {t("candidate")}
              </span>
            </div>
            <div
              className={`p-2 bg-[#0A2647] rounded-lg cursor-pointer flex items-center gap-3 ${
                selectedType === "employer"
                  ? "ring-2 ring-blue-500"
                  : "hover:bg-[#0A2647]/90"
              }`}
              style={{
                transform:
                  isTransitioning && selectedType === "employer"
                    ? "scale(1.05)"
                    : "scale(1)",
                opacity:
                  isTransitioning && selectedType !== "employer" ? 0.5 : 1,
                transition:
                  "transform 0.3s ease-in-out, opacity 0.3s ease-in-out",
              }}
              onClick={() => handleTypeSelect("employer")}
            >
              <Building className="w-6 h-6 text-white" />
              <span className=" text-white text-[12px]">{t("employer")}</span>
            </div>
          </div>
        </Card>

        {/* body */}
        <div className="flex flex-col mt-5">
          <div className="flex flex-col sm:flex-row gap-0 md:gap-5 justify-between">
            <Form.Item
              name="fullName"
              rules={[
                { required: true, message: t("please_input_your_full_name") },
              ]}
              className="w-full"
            >
              <Input
                className="!text-[12px]"
                size="large"
                placeholder={t("full_name")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </Form.Item>
            <Form.Item
              className="!text-[12px] w-full"
              name="username"
              rules={[
                { required: true, message: t("please_input_your_username") },
              ]}
            >
              <Input
                size="large"
                className="!text-[12px]"
                placeholder={t("username")}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("please_input_your_email") },
              { type: "email", message: t("please_input_your_email_valid") },
            ]}
          >
            <Input
              className="!text-[12px]"
              size="large"
              placeholder={t("email_address")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              { required: true, message: t("please_input_your_password") },
            ]}
          >
            <Input.Password
              className="!text-[12px]"
              size="large"
              placeholder={t("password")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              iconRender={(visible) =>
                !visible ? <EyeFilled /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: t("please_input_your_confirm_password"),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              className="!text-[12px]"
              size="large"
              placeholder={t("confirm_password")}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              iconRender={(visible) =>
                !visible ? <EyeFilled /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <Form.Item name="terms" valuePropName="checked">
            <Checkbox className="text-[12px]">
              {t("i_have_read_and_agree_to_the")}{" "}
              <span className="text-blue-500">{t("terms_of_service")}</span>
            </Checkbox>
            <div className="mt-2">
              <span className="text-gray-500 text-[12px]">
                {t("already_have_an_account")}
              </span>
              <span
                onClick={handleNextRegister}
                className="text-blue-500 cursor-pointer text-[12px]"
              >
                {" "}
                {t("login")}
              </span>
            </div>
          </Form.Item>
        </div>

        <LoadingComponent isLoading={isLoading}>
          <div className="flex flex-col gap-5 mt-5 justify-center items-center">
            <Button
              htmlType="submit"
              className="bg-primaryBlue text-white font-bold w-full text-[12px]"
              size="large"
              style={{ backgroundColor: "#0f65cc" }}
            >
              {t("register")}
              {/* <ArrowRightOutlined style={{ fontSize: "18px", fontWeight: "bold" }} /> */}
            </Button>
          </div>
        </LoadingComponent>

        <div className="flex items-center justify-center mt-3 text-gray-500">
          <hr className="w-full h-0.5 bg-gray-500" />
          <p className="mx-2 text-[12px]">{t("or")}</p>
          <hr className="w-full h-0.5 bg-gray-500" />
        </div>

        <div className="flex flex-col lg:flex-row justify-between mt-5 w-full gap-2 pb-5">
          <a href={`${import.meta.env.VITE_API_LOGIN_FACEBOOK}`}>
            <Button className="flex items-center w-full lg:w-auto" size="large">
              <img src={facebook} alt="Facebook" className="w-5 h-5 mr-2" />
              {t("login_with_facebook")}
            </Button>
          </a>
          <a href={`${import.meta.env.VITE_API_LOGIN_GMAIL}`}>
            <Button className="flex items-center w-full lg:w-auto" size="large">
              <img src={google} alt="Google" className="w-5 h-5 mr-2" />
              {t("login_with_google")}
            </Button>
          </a>
        </div>
      </Form>
    );
  };

  const renderItem = (
    preview: boolean,
    icon: any,
    width: number,
    height: number,
    description: string,
    amount: string
  ) => {
    return (
      <div className="flex flex-col items-center justify-center gap-5 text-white font-light">
        <Image preview={preview} src={icon} width={width} height={height} />
        <p>{amount}</p>
        <p>{description}</p>
      </div>
    );
  };
  return (
    <div className="flex justify-between items-start overflow-hidden">
      <div className="mt-5 ml-5">
        <LanguageSwitch />
      </div>
      <div className="flex flex-col gap-[100px] h-screen lg:w-3/6 w-full lg:pl-[150px]">
        <div className="flex align-center justify-center overflow-auto md:overflow-hidden">
          {renderFormCreate()}
        </div>
      </div>
      <div className=" flex-col gap-[100px] h-screen w-2/4 relative lg:flex hidden">
        <img src={logo} alt="" className="fixed h-full" />
        <p className="absolute font-normal text-3xl text-white bottom-[250px] left-[100px]">
          {t("over_1_75_324_candidates", { count: "1000+" })}
          <br /> {t("waiting_for_good_employers")}
        </p>
        <div className="absolute flex gap-[80px] bottom-[100px] left-[100px] justify-between">
          {itemsIcon.map((item) => {
            return renderItem(
              item.preview,
              item.icon,
              item.width,
              item.height,
              item.description,
              item.amount
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
