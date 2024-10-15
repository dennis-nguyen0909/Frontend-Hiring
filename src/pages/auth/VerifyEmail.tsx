import { Button, Image, Input, notification } from "antd";
import React, { useState } from "react";
import logo from '../../assets/icons/logo.png';
import { ArrowRightOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getDetailUser, verifyCode } from "../../services";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { updateUser } from "../../redux/slices/userSlices";
const VerifyEmail = () => {
  const [codeId, setCodeId] = useState<string>('');
  const user = useSelector(state=> state.user)
  console.log("duydeptraiaiia",user)
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch =useDispatch();
  const { email, userId } = location.state || {};

  const onSubmitVerify = async () => {
    try {
      const response = await verifyCode({ id: userId, code_id: codeId });
      console.log("res",response)
      if (response?.data?.user) {
        const {access_token,refresh_token}=response.data
        localStorage.setItem('access_token',access_token);
        localStorage.setItem('refresh_token',refresh_token);
        navigate('/');
        const decodeId = jwtDecode(access_token);
        handleGetDetailUser(decodeId,access_token)
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

  const handleGetDetailUser =async (id:JwtPayload,access_token:string)=>{
    const storage = localStorage.getItem('refresh_token');
    const res = await getDetailUser(id.sub+"", access_token); 
    dispatch(updateUser({ ...res?.data.items, access_token: access_token, refresh_token: storage }));
  }

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
        <div className="flex flex-col gap-5 mt-5 justify-center items-center">
          <Button onClick={onSubmitVerify} className="bg-primaryBlue text-white text-bold w-full" size="large" style={{ backgroundColor: "#0f65cc" }}>
            Verify my Account
            <ArrowRightOutlined style={{ fontSize: '18px', fontWeight: 'bold' }} />
          </Button>
        </div>
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
          <Image src={logo} preview={false} />
          <h1 onClick={()=>navigate("/")} className="font-medium text-2xl cursor-pointer">MyJob</h1>
        </div>
      </div>
      <div className="w-[500px] flex items-center justify-center h-screen" style={{ width: "100%" }}>
        {renderFormVerify()}
      </div>
    </div>
  );
};

export default VerifyEmail;
