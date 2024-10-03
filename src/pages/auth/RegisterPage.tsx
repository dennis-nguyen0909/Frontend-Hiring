import { useState } from "react";
import { Button, Checkbox, Image, Input, notification, Select, Form } from "antd";
import logo from '../../assets/images/logo.png';
import icon from '../../assets/icons/logo.png';
import { ArrowRightOutlined, EyeFilled, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as authService from '../../services/authServices';
import LoadingComponent from "../../components/Loading/LoadingComponent";
import { itemsIcon } from "../../helper";
import facebook from '../../assets/icons/fb.png'
import google from '../../assets/icons/gg.png'
const LoginPage = () => {
    const [fullName, setFullName] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [role, setRole] = useState<string>('USER');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleNextRegister = () => {
        navigate('/login');
    };

    const handleSubmit = async (values: any) => {
        try {
            setIsLoading(true);
            const { fullName, username, email, password, role } = values;
            const res = await authService.register({ full_name: fullName, username, email, password, role });
            if (res.data) {
                notification.success({
                    message: "Notification",
                    description: "Register success",
                });
                navigate('/verify', {
                    state: {
                        email: email,
                        userId: res.data.user_id,
                    },
                });
            }
            console.log("duydeptrai",res)
            if(+res.error_code === 400){
                notification.error({
                    message: "Notification",
                    description: res?.message,
                });
            }
        } catch (error) {
            console.error(error);
        }
        setIsLoading(false);
    };

    const renderFormCreate = () => {
        return (
            <Form
                className="w-[500px]"
                layout="vertical"
                onFinish={handleSubmit}
                initialValues={{ role }}
            >
                {/* header */}                
                <div className="flex items-center justify-start mt-10 gap-2">
                    <Image src={icon} preview={false} />
                    <h1 onClick={()=>navigate("/")} className="font-medium text-2xl cursor-pointer">MyJob</h1>

                </div>
                <div className="flex gap-10 items-center header justify-between mt-[200px]">
                    <div>
                        <h1 className="font-medium text-3xl">Create account.</h1>
                        <div className="mt-2">
                            <span className="text-gray-500 text-1xl">Already have an account?</span>
                            <span onClick={handleNextRegister} className="text-blue-500 cursor-pointer"> Log In</span>
                        </div>
                    </div>
                    <Form.Item name="role">
                        <Select
                            value={role}
                            onChange={(value) => setRole(value)}
                            placeholder="Select a role"
                            options={[
                                { value: 'EMPLOYER', label: 'Employer' },
                                { value: 'USER', label: 'User' },
                            ]}
                        />
                    </Form.Item>
                </div>
                {/* body */}
                <div className="flex flex-col mt-5">
                    <div className="flex gap-5 justify-between">
                        <Form.Item
                            name="fullName"
                            rules={[{ required: true, message: 'Please enter your full name' }]}
                        >
                            <Input size="large" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </Form.Item>
                        <Form.Item
                            name="username"
                            rules={[{ required: true, message: 'Please enter your username' }]}
                        >
                            <Input size="large" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </Form.Item>
                    </div>
                    <Form.Item
                        name="email"
                        rules={[
                            { required: true, message: 'Please enter your email' },
                            { type: 'email', message: 'The input is not valid email' }
                        ]}
                    >
                        <Input size="large" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </Form.Item>
                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password' }]}
                    >
                        <Input.Password
                            size="large"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            iconRender={(visible) => (!visible ? <EyeFilled /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        dependencies={['password']}
                        hasFeedback
                        rules={[
                            { required: true, message: 'Please confirm your password' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Passwords do not match!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            size="large"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            iconRender={(visible) => (!visible ? <EyeFilled /> : <EyeInvisibleOutlined />)}
                        />
                    </Form.Item>
                    <Form.Item
                        name="terms"
                        valuePropName="checked"
                        rules={[{ validator: (_, value) => value ? Promise.resolve() : Promise.reject('Should accept terms') }]}
                    >
                        <Checkbox>
                            I've read and agree with your <span className="text-blue-500">Terms of Services</span>
                        </Checkbox>
                    </Form.Item>
                </div>
                <LoadingComponent isLoading={isLoading}>
                    <div className="flex flex-col gap-5 mt-5 justify-center items-center">
                        <Button htmlType="submit" className="bg-primaryBlue text-white text-bold w-full" size="large" style={{ backgroundColor: "#0f65cc" }}>
                            Sign in <ArrowRightOutlined style={{ fontSize: '18px', fontWeight: 'bold' }} />
                        </Button>
                    </div>
                </LoadingComponent>
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
            </Form>
        );
    };

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
            <div className="flex flex-col gap-[100px] h-screen w-3/6 pl-[150px]">
                <div className="flex align-center justify-center">{renderFormCreate()}</div>
            </div>
            <div className="flex flex-col gap-[100px] h-screen w-2/4 relative">
                <img src={logo} alt="" className="w-[1000px] h-[1000px] position-absolute" />
                <p className="absolute font-normal text-3xl text-white bottom-[250px] left-[100px]">Over 1,75,324 candidates<br /> waiting for good employers.</p>
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
