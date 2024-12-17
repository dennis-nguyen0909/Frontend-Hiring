import { Button, Form, Image, Input } from "antd";
import { useState } from "react";
import logo from "../../assets/icons/logo.png";
import { EyeFilled, EyeInvisibleOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";

const ResetPage = () => {
  const [codeId, setCodeId] = useState<string>("");
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleResetPassword = async () => {};

  const renderFormVerify = () => {
    return (
        <Form onFinish={handleResetPassword}>
        <div className="flex flex-col gap-5">
            <div className="text-center">
            <h1 className="text-3xl font-normal">Reset Password</h1>
            </div>
            <div className="text-center text-gray-500">
            <p>
                Duis luctus interdum metus, ut consectetur ante consectetur sed.
                <br /> Suspendisse euismod viverra massa sit amet mollis.
            </p>
            </div>
            <div>
            <Form.Item
                name="password"
                rules={[{ required: true, message: "Please enter your password" }]}
            >
                <Input.Password
                size="large"
                placeholder="Password"
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
                { required: true, message: "Please confirm your password" },
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
                size="large"
                placeholder="Xác nhận mật khẩu"
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
                className="bg-primaryBlue text-white text-bold w-full"
                size="large"
                style={{ backgroundColor: "#0f65cc" }}
            >
                Reset Password
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
          <Image src={logo} preview={false} />
          <h1 onClick={()=>navigate("/")} className="font-medium text-2xl cursor-pointer">HireDev</h1>

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
