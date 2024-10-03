import React from "react";
import { Button, Checkbox, CheckboxProps, Image, Input, Select } from "antd";
import logo from '../../assets/images/logo.png';
import icon from '../../assets/icons/logo.png'
import facebook from '../../assets/icons/fb.png'
import google from '../../assets/icons/gg.png'
import { ArrowRightOutlined, EyeFilled, EyeInvisibleOutlined} from "@ant-design/icons";
import bagIcon from '../../assets/icons/bag.png'
import buldingIcon from '../../assets/icons/building.png'
import { useNavigate } from "react-router-dom";

const itemsIcon = [
    {
        icon:bagIcon,
        width:50,
        height:50,
        description:"Live Job",
        preview:false,
        amount: "1,75,324"
    },
    {
        icon:buldingIcon,
        width:50,
        height:50,
        description:"Companies",
        preview:false,
        amount: "97,354"
    },
    {
        icon:bagIcon,
        width:50,
        height:50,
        description:"New Jobs",
        preview:false,
        amount: "7,532"
    },
]


const LoginPage = () => {
    const navigate =useNavigate()
    const onChange: CheckboxProps['onChange'] = (e) => {
        console.log(`checked = ${e.target.checked}`);
      };

      const handleNavigateRegister = ()=>{
        navigate('/register')
      }
    const renderFormCreate = ()=>{
        return (
            <div className="w-[500px]">
                {/* header */}
                <div className="flex gap-10 items-center header justify-between">
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
                        size="large"
                            placeholder="Password"
                            iconRender={(visible) => (!visible ? <EyeFilled /> : <EyeInvisibleOutlined />)}
                        />
                </div>
                    <div className="flex justify-between gap-3 mt-5">
                    <Checkbox onChange={onChange}>Remember me</Checkbox>
                    <span className="text-blue-500">Forget password</span>
                    </div>
                <div className="flex flex-col gap-5 mt-5 justify-center items-center">
                    <Button className="bg-primaryBlue text-white text-bold w-full" size="large"  style={{backgroundColor:"#0f65cc"}}>Create account  <ArrowRightOutlined  style={{fontSize:'18px',fontWeight:'bold'}} /></Button>
                </div>
                <div className="flex items-center justify-center mt-3 ml-[]">
                    <p>or</p>
                </div>
                <div className="flex justify-between mt-5  w-full" >
                    <Button className="flex items-center" size="large">
                        <img src={facebook} alt="Facebook" className="w-5 h-5 mr-2" />
                        Sign up with Facebook
                    </Button>
                    <Button className="flex items-center" size="large">
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
    <div className="flex justify-between items-center">
        <div className="flex flex-col gap-[100px]  h-screen w-3/6 pl-[150px]">
            <div className="flex items-center justify-start mt-10 gap-2 ">
                <Image src={icon} preview={false} />
                <h1 className="font-medium text-2xl">MyJob</h1>
            </div>
            <div className="flex align-center justify-start ">{renderFormCreate()}</div>
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
