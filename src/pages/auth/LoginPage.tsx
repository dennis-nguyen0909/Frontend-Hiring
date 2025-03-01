import { useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Image,
  Input,
  Form,
  message,
  Modal,
  Steps,
  notification,
} from "antd";
import logo from "../../assets/images/logo.png";
import icon from "../../assets/logo/LogoH.png";
import facebook from "../../assets/icons/fb.png";
import google from "../../assets/icons/gg.png";
import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  EyeFilled,
  EyeInvisibleOutlined,
  LoadingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { itemsIcon } from "../../helper";
import { useDispatch, useSelector } from "react-redux";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { getDetailUser, login, retryActive, verifyCode } from "../../services";
import { updateUser } from "../../redux/slices/userSlices";
import LoadingComponent from "../../components/Loading/LoadingComponent";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../../components/LanguagesSwitch/LanguagesSwitch";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const user = useSelector((state) => state.user);
  const [isActiveUser, setIsActiveUser] = useState<boolean>(false);
  const [userIdVerify, setUserIdVerify] = useState<string>("");
  const [codeId, setCodeId] = useState<string>("");
  const [modalVisible, setModalVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (user?.access_token) {
      try {
        const decodedToken = jwtDecode(user.access_token);
        const currentTime = Date.now() / 1000;
        if (decodedToken?.exp > currentTime) {
          navigate("/");
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, [user.access_token]);

  const handleNavigateRegister = () => {
    navigate("/register");
  };

  const handleGetDetailUser = async (id: JwtPayload, access_token: string) => {
    try {
      const refresh_token = localStorage.getItem("refresh_token") || "";
      const res = await getDetailUser(id.sub + "", access_token);
      if (res.data.items) {
        dispatch(
          updateUser({
            ...res?.data.items,
            access_token: access_token,
            refresh_token: refresh_token,
          })
        );
        navigate("/", {
          state: {
            userId: res?.data?.item?._id,
          },
        });
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
      }
    } catch (error) {
      notification.error({
        message: t("failed_to_fetch_user_details"),
        description: error.message,
      });
    }
  };
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      // await new Promise(resolve => setTimeout(resolve, 3000))
      const { email, password } = values;
      const res = await login({ username: email, password });
      if (res.data.user) {
        localStorage.setItem("refresh_token", res.data.user.refresh_token);
        const { access_token } = res.data.user;
        const decoded = jwtDecode(access_token);
        if (decoded?.sub) {
          await handleGetDetailUser(decoded, access_token);
        }
      } else if (+res.error_code === 400) {
        setIsActiveUser(true);
        setModalVisible(true);
      } else {
        message.success(res.message[0]);
      }
    } catch (error: any) {
      // Kiểm tra xem error.message có chứa userId không
      if (
        error.message.includes("User not active") &&
        error.message.includes("ID")
      ) {
        const userId = error.message.split("ID ")[1]; // Lấy userId từ error.message
        if (userId) {
          navigate("/verify", {
            state: {
              email: values.email,
              userId: userId,
            },
          });
          const res = await retryActive(values.email);
        }
      } else {
        notification.error({
          message: t("login_failed"),
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  const next = () => {
    setCurrent(current + 1);
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const onFinish = (values) => {
    next();
  };

  const renderFormCreate = () => {
    return (
      <div className="mx-4 lg:mx-10">
        <div className="flex items-center lg:justify-start justify-center lg:mt-10 mt-4 gap-2">
          <Image src={icon} width={45} height={45} preview={false} />
          <h1
            onClick={() => navigate("/")}
            className="font-medium text-2xl cursor-pointer"
          >
            HireDev
          </h1>
        </div>
        {/* Header */}
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-10 items-center justify-between lg:mt-[200px] mt-[150px] px-4 lg:px-0">
          <div>
            <h1 className="font-medium text-2xl lg:text-3xl">{t("login")}</h1>
            <div className="mt-2">
              <span className="text-gray-500 text-sm lg:text-lg">
                {t("no_account")}
              </span>
              <span
                onClick={handleNavigateRegister}
                className="text-blue-500 cursor-pointer"
              >
                {t("create_account")}
              </span>
            </div>
          </div>
        </div>
        {/* Body */}
        <Form
          onFinish={handleLogin}
          layout="vertical"
          className="flex flex-col mt-5 px-4 lg:px-0"
        >
          <Form.Item
            className="w-full"
            name="email"
            rules={[{ required: true, message: t("please_input_your_email") }]}
          >
            <Input
              size="large"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            className="w-full"
            name="password"
            rules={[
              { required: true, message: t("please_input_your_password") },
            ]}
          >
            <Input.Password
              size="large"
              placeholder={t("password")}
              iconRender={(visible) =>
                visible ? <EyeFilled /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>
          <div className="flex justify-between gap-3 mt-5">
            <Checkbox
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            >
              {t("remember_account")}
            </Checkbox>
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-blue-500"
            >
              {t("forgot_password")}
            </span>
          </div>
          <div className="w-full">
            <LoadingComponent isLoading={isLoading}>
              <div className="flex flex-col mt-5 justify-center items-center">
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full"
                  size="large"
                  style={{ backgroundColor: "#0f65cc" }}
                >
                  {t("login")}
                  <ArrowRightOutlined
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  />
                </Button>
              </div>
            </LoadingComponent>
          </div>
        </Form>
        <div className="flex items-center justify-center mt-3 text-gray-500">
          <hr className="w-full h-0.95 bg-gray-500" />
          <p className="mx-2">{t("or")}</p>
          <hr className="w-full h-0.95 bg-gray-500" />
        </div>
        <div className="flex flex-col lg:flex-row justify-between mt-5 w-full gap-2">
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
      </div>
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

  const onSubmitVerify = async () => {
    try {
      const response = await verifyCode({ id: userIdVerify, code_id: codeId });
      if (response?.data?.user) {
        setCurrent(current + 1);
      } else {
        notification.error({
          message: "Thông báo",
          description: response?.message[0],
        });
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  const handleNext = async () => {
    setCurrent(current + 1);
    try {
      const res = await retryActive(email);
      if (res.data) {
        setUserIdVerify(res.data.user_id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onCloseModal = () => {
    setCurrent(0);
    setModalVisible(false);
    setEmail("");
    setCodeId("");
    setUserIdVerify("");
    setIsActiveUser(false);
  };
  return (
    <div className="flex justify-between items-start overflow-hidden">
      <div className="mt-5 ml-5">
        <LanguageSwitch />
      </div>
      <div className="flex flex-col gap-[100px] h-screen lg:w-3/6 w-full lg:pl-[150px]">
        <div className="flex align-center justify-center ">
          {renderFormCreate()}
        </div>
      </div>
      <div className="flex-col gap-[100px] h-screen w-2/4 relative hidden lg:flex">
        <img src={logo} alt="Logo" className=" w-full fixed h-full" />
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
      <Modal
        title="Kích hoạt tài khoản"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null} // Tắt footer của modal
        width={600}
      >
        <Steps
          current={current}
          items={[
            {
              title: "Quên mật khẩu?",
              icon: <UserOutlined />,
            },
            {
              title: "Verify",
              icon: <LoadingOutlined />,
            },
            {
              title: "Done",
              icon: <CheckCircleOutlined />,
            },
          ]}
        />
        <div style={{ marginTop: "20px" }}>
          {current === 0 && (
            <Form layout="vertical" onFinish={onFinish}>
              <Form.Item label="Email" name="email">
                <Input placeholder={email} value={email} disabled />
              </Form.Item>
            </Form>
          )}
          {current === 1 && (
            <div className="flex flex-col gap-5">
              <div className="text-center">
                <h1 className="text-3xl font-normal">Email Verification</h1>
              </div>
              <div className="text-center text-gray-500">
                <p>
                  We've sent a verification to{" "}
                  <span className="text-black">
                    {email ? email : "@gmail.com"}
                  </span>{" "}
                  to verify your <br /> email address and activate your account.
                </p>
              </div>
              <div>
                <Input
                  value={codeId}
                  size="large"
                  placeholder="Verification Code"
                  onChange={(e) => setCodeId(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-5 mt-5 justify-center items-center">
                <Button
                  onClick={onSubmitVerify}
                  className="bg-primaryBlue text-white text-bold w-full"
                  size="large"
                  style={{ backgroundColor: "#0f65cc" }}
                >
                  Verify my Account
                  <ArrowRightOutlined
                    style={{ fontSize: "18px", fontWeight: "bold" }}
                  />
                </Button>
                {current > 0 && <Button onClick={prev}>Quay lại</Button>}
              </div>
              <div className="text-center">
                <span>Didn’t receive any code?</span>
                <span className="text-blue-500"> Resend</span>
              </div>
            </div>
          )}
          {current === 2 && (
            <div className="flex items-center justify-center h-[300px] flex-col gap-10">
              <CheckCircleOutlined
                style={{ fontSize: "100px", color: "green" }}
              />
              <h3>Kích hoạt tài khoản thành công!</h3>
              <div className="w-[100%]">
                <Button onClick={onCloseModal} type="primary">
                  Done
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center flex-end">
          {current !== 2 && current !== 1 && (
            <Button onClick={handleNext} type="primary">
              Tiếp theo
            </Button>
          )}
          {current > 0 && current !== 1 && current !== 2 && (
            <Button style={{ margin: "0 8px" }} onClick={prev}>
              Quay lại
            </Button>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default LoginPage;
