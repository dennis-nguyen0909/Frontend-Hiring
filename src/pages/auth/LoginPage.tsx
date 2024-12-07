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
import icon from "../../assets/icons/logo.png";
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
import { USER_API } from "../../services/modules/userServices";
import LoadingComponent from "../../components/Loading/LoadingComponent";

const LoginPage = () => {
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const user = useSelector((state) => state.user);
  const [isActiveUser, setIsActiveUser] = useState<boolean>(false);
  const [userIdVerify,setUserIdVerify]=useState<string>('')
  const [codeId,setCodeId]=useState<string>("")
  const [modalVisible, setModalVisible] = useState(false);
  const [current, setCurrent] = useState(0);
  const dispatch = useDispatch();
  const [email, setEmail] = useState<string>("");
  const[isLoading,setIsLoading]=useState<boolean>(false)

  const handleCheckActiveUser=async()=>{
    con
  }
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
        const refresh_token = localStorage.getItem("refresh_token") || '';
        const res = await getDetailUser(id.sub + "", access_token);
        if(res.data.items){
          dispatch(
              updateUser({
                  ...res?.data.items,
                  access_token: access_token,
                  refresh_token: refresh_token,
              })
          );
          navigate("/",{
            state:{
              userId:res?.data?.item?._id
            }
          });
          localStorage.setItem("access_token", access_token);
          localStorage.setItem("refresh_token", refresh_token);
        }
    } catch (error) {
        notification.error({
            message: "Failed to fetch user details",
            description: error.message,
        });
    }
};
  const handleLogin = async (values: { email: string; password: string }) => {
    try {
      setIsLoading(true)
      // await new Promise(resolve => setTimeout(resolve, 3000))
      const { email, password } = values;
      const res = await login({ username: email, password });
      if (res.data.user) {
        const { access_token} = res.data.user;
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
      if (error.message.includes('User not active') && error.message.includes('ID')) {
        const userId = error.message.split('ID ')[1]; // Lấy userId từ error.message
        if (userId) {
          navigate('/verify', {
            state: {
              email: values.email,
              userId: userId,
            },
          });
          const res = await retryActive(values.email);
        }
      } else {
        notification.error({
          message: "Login failed",
          description: error.message,
        });
      }
    }finally{
      setIsLoading(false)
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

  const handleActivation = () => {
    message.success("Account activated successfully!");
    setModalVisible(false); // Đóng modal sau khi kích hoạt thành công
  };

  const renderFormCreate = () => {
    return (
      <div className="w-[500px]">
        <div className="flex items-center justify-start mt-10 gap-2 ">
          <Image src={icon} preview={false} />
          <h1
            onClick={() => navigate("/")}
            className="font-medium text-2xl cursor-pointer"
          >
            HireDev
          </h1>
        </div>
        {/* Header */}
        <div className="flex gap-10 items-center justify-between mt-[200px]">
          <div>
            <h1 className="font-medium text-3xl">Sign in.</h1>
            <div className="mt-2">
              <span className="text-gray-500 text-1xl">
                Don’t have an account?
              </span>
              <span
                onClick={handleNavigateRegister}
                className="text-blue-500 cursor-pointer"
              >
                {" "}
                Create Account
              </span>
            </div>
          </div>
        </div>
        {/* Body */}
        <Form
          onFinish={handleLogin}
          layout="vertical"
          className="flex flex-col  mt-5"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input
              size="large"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              size="large"
              placeholder="Password"
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
              Remember me
            </Checkbox>
            <span
              onClick={() => navigate("/forgot-password")}
              className="text-blue-500"
            >
              Forget password?
            </span>
          </div>
         <div className="w-full">
         <LoadingComponent  isLoading={isLoading}>
          <div className="flex flex-col  mt-5 justify-center items-center">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full"
              size="large"
              style={{ backgroundColor: "#0f65cc" }}
            >
              Sign In{" "}
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
          <p className="mx-2">or</p>
          <hr className="w-full h-0.95 bg-gray-500" />
        </div>
        <div className="flex justify-between mt-5 w-full">
          <Button
            className="flex items-center"
            size="large"
            style={{ width: "240px" }}
          >
            <img src={facebook} alt="Facebook" className="w-5 h-5 mr-2" />
            Sign up with Facebook
          </Button>
          <Button
            className="flex items-center"
            size="large"
            style={{ width: "240px" }}
          >
            <img src={google} alt="Google" className="w-5 h-5 mr-2" />
            Sign up with Google
          </Button>
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
        setCurrent(current+1)
      }else{
        notification.error({
          message: "Notification",
          description: response?.message[0],
        })
      }
    } catch (error) {
      console.error("Error during verification:", error);
    }
  };

  const handleNext = async()=>{
    setCurrent(current+1);
    try {
       const res =await retryActive(email);
       if(res.data){
        setUserIdVerify(res.data.user_id)
       }
    } catch (error) {
        console.error(error);
    }
    
  }

  const onCloseModal = ()=>{
    setCurrent(0)
    setModalVisible(false)
    setEmail('')
    setCodeId('')
    setUserIdVerify('')
    setIsActiveUser(false)
  }
  return (
    <div className="flex justify-between items-center overflow-hidden">
      <div className="flex flex-col gap-[100px] h-screen w-3/6 pl-[150px]">
        <div className="flex align-center justify-center ">
          {renderFormCreate()}
        </div>
      </div>
      <div className="flex flex-col gap-[100px] h-screen w-2/4 relative">
        <img
          src={logo}
          alt="Logo"
          className="  position-absolute h-auto"
        />
        <p className="absolute font-normal text-3xl text-white bottom-[250px] left-[100px]">
          Over 1,75,324 candidates
          <br /> waiting for good employees.
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
              title: "Login",
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
              <p>We've sent a verification to <span className="text-black">{email ? email : "@gmail.com"}</span> to verify your <br /> email address and activate your account.</p>
            </div>
            <div>
              <Input value={codeId} size="large" placeholder="Verification Code" onChange={(e) => setCodeId(e.target.value)} />
            </div>
            <div className="flex flex-col gap-5 mt-5 justify-center items-center">
              <Button onClick={onSubmitVerify} className="bg-primaryBlue text-white text-bold w-full" size="large" style={{ backgroundColor: "#0f65cc" }}>
                Verify my Account
                <ArrowRightOutlined style={{ fontSize: '18px', fontWeight: 'bold' }} />
              </Button>
               { current > 0 && <Button  onClick={prev}>
                Quay lại
                </Button>}
            </div>
            <div className="text-center">
              <span>Didn’t receive any code?</span>
              <span className="text-blue-500"> Resend</span>
            </div>
          </div>
          )}
          {current === 2 && (
            <div className="flex items-center justify-center h-[300px] flex-col gap-10">
              <CheckCircleOutlined style={{fontSize:'100px',color:'green'}} />
              <h3>Kích hoạt tài khoản thành công!</h3>
              <div className="w-[100%]">
                <Button onClick={onCloseModal} type="primary">Done</Button>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center flex-end">
          {current !== 2 && current !== 1 && (
            <Button
              onClick={handleNext}
              type="primary"
            >
              Tiếp theo
            </Button>
          )}
          {current > 0 && current!==1  && current!==2 && (
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
