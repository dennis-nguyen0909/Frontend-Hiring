import React, { useState } from "react";
import { Button, Checkbox, CheckboxProps, Image, Input, Select } from "antd";
import logo from '../../assets/images/logo.png';
import icon from '../../assets/icons/logo.png'
import facebook from '../../assets/icons/fb.png'
import google from '../../assets/icons/gg.png'
import { ArrowRightOutlined, EyeFilled, EyeInvisibleOutlined} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as authService from '../../services/authServices'
import { itemsIcon } from "../../helper";
// full_name: string;
// email: string;
// password: string;
// role:string;

const LoginPage = () => {
    const navigate =useNavigate()
    const[fullName,setFullName]=useState<string>('')
    const[email,setEmail]=useState<string>('')
    const[password,setPassword]=useState<string>('')
    const[confirmPassword,setConfirmPassword]=useState<string>('')
    const[role,setRole]=useState<string>('')

    const onChange: CheckboxProps['onChange'] = (e) => {
        console.log(`checked = ${e.target.checked}`);
      };

      const handleNavigateRegister = ()=>{
        navigate('/register')
      }

      const handleRegister = async()=>{
        try {
            const res = await authService.register();
        } catch (error) {
            
        }
      }
    const renderFormCreate = ()=>{
        return (
            <div className="w-[500px]">
                            <div className="flex items-center justify-start mt-10 gap-2 ">
                <Image src={icon} preview={false} />
                <h1 onClick={()=>navigate("/")} className="font-medium text-2xl cursor-pointer">MyJob</h1>

            </div>
                {/* header */}
                <div className="flex gap-10 items-center header justify-between mt-[200px]">
                <div>
                    <h1 className="font-medium text-3xl">Sign in.</h1>
                    <div className="mt-2">
                    <span className="text-gray-500 text-1xl">Don’t have account?</span><span onClick={handleNavigateRegister} className="text-blue-500  cursor-pointer">Create Account</span>
                    </div>
                </div>
                </div>
                {/* body */}
                <div className="flex flex-col gap-5 mt-5">
                    <Input size="large" placeholder="Email address" />
                        <Input.Password
                            value={password}
                            size="large"
                            placeholder="Password"
                            iconRender={(visible) => (!visible ? <EyeFilled /> : <EyeInvisibleOutlined />)}
                        />
                </div>
                    <div className="flex justify-between gap-3 mt-5">
                    <Checkbox onChange={onChange}>Remember me</Checkbox>
                    <span onClick={()=>navigate('/forgot-password')} className="text-blue-500">Forget password</span>
                    </div>
                <div className="flex flex-col gap-5 mt-5 justify-center items-center">
                    <Button className="bg-primaryBlue text-white text-bold w-full" size="large"  style={{backgroundColor:"#0f65cc"}}>Create account  <ArrowRightOutlined  style={{fontSize:'18px',fontWeight:'bold'}} /></Button>
                </div>
                <div className="flex items-center justify-center mt-3 text-gray-500">
                    <hr className="w-full h-0.95 bg-gray-500" />
                    <p className="mx-2">or</p>
                    <hr className="w-full h-0.95 bg-gray-500" />
                </div>

                <div className="flex justify-between mt-5  w-full" >
                    <Button className="flex items-center" size="large" style={{width:'240px'}}>
                        <img src={facebook} alt="Facebook" className="w-5 h-5 mr-2" />
                        Sign up with Facebook
                    </Button>
                    <Button className="flex items-center" size="large" style={{width:'240px'}}>
                        <img src={google} alt="Google" className="w-5 h-5 mr-2" />
                        Sign up with Google
                    </Button>
                </div>
            </div>
        )
    }

    const renderItem = (preview:boolean , icon: any ,width:number ,height:number,description:string,amount:string)=>{
        return (
            <div className="flex flex-col items-center justify-center gap-5 text-white font-light">
                    <Image preview={preview} src={icon} width={width} height={height} />
                    <p>{amount}</p>
                    <p>{description}</p>
            </div>
        )
    }
  return (
    <div className="flex justify-between items-center overflow-hidden">
        <div className="flex flex-col gap-[100px]  h-screen w-3/6 pl-[150px]">
            <div className="flex align-center justify-center ">{renderFormCreate()}</div>
        </div>
        <div className="flex flex-col gap-[100px]  h-screen w-2/4 relative ">
            <img src={logo} alt="" className="w-[1000px] h-[1000px] position-absolute" />
            <p className="absolute font-normal text-3xl text-white bottom-[250px] left-[100px]">Over 1,75,324 candidates<br/> waiting for good employees.</p>
            <div className="absolute flex gap-[80px] bottom-[100px] left-[100px] justify-between">
                {itemsIcon.map((item)=> {
                    return(
                        renderItem(item.preview,item.icon,item.width,item.height,item.description,item.amount)
                    )
                })}
            </div>
        </div>
    </div>
  );
};

export default LoginPage;
