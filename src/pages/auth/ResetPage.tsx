import { Avatar, Button, Form, Input } from "antd";
import { useState, useEffect } from "react";
import logo from "../../assets/logo/LogoH.png";
import { EyeFilled, EyeInvisibleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as authServices from "../../services/modules/authServices";
import { useTranslation } from "react-i18next";

const ResetPage = () => {
  const { t } = useTranslation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const handleResetPassword = async () => {
    try {
      const response = await authServices.resetNewPassword(
        state?.email,
        password
      );
      if (+response.statusCode === 201) {
        await toast.success("Đặt lại mật khẩu thành công");
        navigate("/login");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    // Kiểm tra nếu cả password và confirmPassword đã được nhập đúng thì enable button
    if (
      password.length >= 6 &&
      confirmPassword.length >= 6 &&
      password === confirmPassword
    ) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [password, confirmPassword]);

  const renderFormVerify = () => {
    return (
      <Form onFinish={handleResetPassword}>
        <div className="flex flex-col gap-5">
          <div className="text-center">
            <h1 className="text-3xl font-normal">{t("reset_password")}</h1>
          </div>
          <div className="text-center text-gray-500">
            <p>
              {t(
                "password_must_contain_at_least_8_characters_one_uppercase_letter_one_lowercase_letter_one_number_and_one_special_character"
              )}
            </p>
          </div>
          <div>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: t("please_enter_your_password") },
              ]}
            >
              <Input.Password
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
                { required: true, message: t("please_confirm_your_password") },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(t("passwords_do_not_match"))
                    );
                  },
                }),
              ]}
            >
              <Input.Password
                size="large"
                placeholder={t("confirm_password")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                iconRender={(visible) =>
                  !visible ? <EyeFilled /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
          </div>
          <div className="flex flex-col gap-5 mt-5 justify-center items-center">
            <Button
              onClick={handleResetPassword}
              className={`${
                isButtonDisabled
                  ? "bg-gray-400 text-gray-600"
                  : "!bg-primaryBlue text-white"
              } text-bold w-full`}
              size="large"
              disabled={isButtonDisabled}
            >
              {t("reset_password")}
            </Button>
          </div>
          <div className="flex flex-col gap-5 mt-5 justify-center items-center">
            <Button
              onClick={() => navigate(-1)}
              className={` bg-gray-400 text-gray-600 text-bold w-full`}
              size="large"
            >
              {t("go_back_to")}
            </Button>
          </div>
        </div>
      </Form>
    );
  };

  return (
    <div>
      <div className="w-full flex justify-center items-center flex-col fixed">
        <div className="flex items-center justify-start mt-10 gap-2 ">
          <Avatar src={logo} size={64} shape="square" />
          <h1
            onClick={() => navigate("/")}
            className="font-medium text-2xl cursor-pointer"
          >
            HireDev
          </h1>
        </div>
      </div>
      <div
        className="w-[500px] flex items-center justify-center h-screen"
        style={{ width: "100%" }}
      >
        {renderFormVerify()}
      </div>
    </div>
  );
};

export default ResetPage;
