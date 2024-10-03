import { Button, Image, Input } from "antd";
import React from "react";
import logo from '../../assets/icons/logo.png'
import { ArrowRightOutlined } from "@ant-design/icons";
const VerifyEmail = ()=>{

    const renderFormVerify = ( ) =>{
        return (
            <div className="flex flex-col gap-5" >
                <div className="text-center">
                    <h1 className="text-3xl font-normal">Email Verification</h1>
                </div>
                <div className="text-center text-gray-500">
                        <p>We've sent an verification to <span className="text-black">emailaddress@gmail.com</span> to verify your <br/> email address and activate your account.</p>
                </div>
                <div>
                    <Input size="large" placeholder="Verification Code" />
                </div>
                <div className="flex flex-col gap-5 mt-5 justify-center items-center">
                    <Button className="bg-primaryBlue text-white text-bold w-full" size="large"  style={{backgroundColor:"#0f65cc"}}>Verify my Account
                    <ArrowRightOutlined  style={{fontSize:'18px',fontWeight:'bold'}} /></Button>
                </div>
                <div className="text-center">
                    <span>Didn’t recieve any code!</span>
                    <span className="text-blue-500">Resends</span>
                </div>
            </div>
        )
    }
    return (
        <div>
            <div className="w-full flex justify-center items-center flex-col fixed">
                    <div className="flex items-center justify-start mt-10 gap-2 ">
                            <Image src={logo} preview={false} />
                            <h1 className="font-medium text-2xl">MyJob</h1>
                        </div>
            </div>
            <div className="w-[500px] flex items-center justify-center h-screen " style={{width:"100%"}}>
                {renderFormVerify()}
            </div>
        </div>
    )
}



export default VerifyEmail;
