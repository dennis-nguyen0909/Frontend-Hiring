import { Button, Image, Input, notification } from "antd";
import { useEffect, useState } from "react";
import logo from '../../assets/logo/LogoH.png';
import { ArrowRightOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { getDetailUser, verifyCode } from "../../services";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slices/userSlices";
import LoadingComponent from "../../components/Loading/LoadingComponent";
const VerifyEmail = () => {
  const [codeId, setCodeId] = useState<string>('');
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading,setIsLoading]=useState<boolean>(false)
  const dispatch = useDispatch()
  const { email, userId } = location.state || {};
  useEffect(()=>{
      if(!email || !userId){
        navigate('/');
      }
  },[email,userId])
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
  const onSubmitVerify = async () => {
    try {
      setIsLoading(true)
      const response = await verifyCode({ id: userId, code_id: codeId });
      if (response?.data) {
        const {access_token}=response.data
        const decoded = jwtDecode(access_token);
        if (decoded?.sub) {
         await handleGetDetailUser(decoded, access_token);
        }
      }else{
        notification.error({
          message: "Thông báo",
          description: response?.message[0],
        })
      }
    } catch (error) {
      notification.error({
        message: "Thông báo",
        description: error.message,
      })
    }finally{
      setIsLoading(false)
    }
  };

  
  const renderFormVerify = () => {
    return (
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
        <LoadingComponent isLoading={isLoading}>
          <div className="flex flex-col gap-5 mt-5 justify-center items-center">
            <Button onClick={onSubmitVerify} className="bg-primaryBlue text-white text-bold w-full" size="large" style={{ backgroundColor: "#0f65cc" }}>
              Verify my Account
              <ArrowRightOutlined style={{ fontSize: '18px', fontWeight: 'bold' }} />
            </Button>
          </div>
        </LoadingComponent>
        <div className="text-center">
          <span>Didn’t receive any code?</span>
          <span className="text-blue-500"> Resend</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="w-full flex justify-center items-center flex-col fixed">
        <div className="flex items-center justify-start mt-10 gap-2 ">
          <Image width={40} height={40} src={logo} preview={false} />
          <h1 onClick={()=>navigate("/")} className="font-medium text-2xl cursor-pointer">HireDev</h1>
        </div>
      </div>
      <div className="w-[500px] flex items-center justify-center h-screen" style={{ width: "100%" }}>
        {renderFormVerify()}
      </div>
    </div>
  );
};

export default VerifyEmail;
