import React, { useState } from "react";
import { PhoneOutlined, SearchOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { menuHeader } from "../../helper";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Button, Image, Input, Select } from "antd";
import phoneCall from "../../assets/icons/phone.png";
import LanguageSelector from "../ui/LanguageSelector";
import icon from '../../assets/icons/logo.png'

const Header: React.FC = () => {
  // Khởi tạo phone với số mặc định
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  const [phone, setPhone] = useState<string>("1234567890");
  const navigate = useNavigate();

  const handleLogin = () => {
    navigation("/login");
  };

  const handleRegister = () => {
    navigation("/register");
  };

  const handleChangePhone = (value: string) => {
    console.log("Số điện thoại:", value);
    setPhone(value); // Cập nhật giá trị số điện thoại vào state
  };
  const handleChange = (value: string) => {
    setSelectedLanguage(value)
    console.log(`Selected language: ${value}`)
    // Here you can add logic to change the application's language
  }
  const languages:any = [
    {
      code: 'vi',
      name: 'Tiếng Việt',
      flag: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 30 20">
          <rect width="30" height="20" fill="#DA251D"/>
          <polygon points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85" fill="#FFFF00"/>
        </svg>
      ),
    },
    {
      code: 'en',
      name: 'English',
      flag: (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="16" viewBox="0 0 30 20">
          <clipPath id="t">
            <path d="M15,10 h15 v10 z v-10 h-15 z h-15 v10 z v-10 h15 z"/>
          </clipPath>
          <path d="M0,0 v20 h30 v-20 z" fill="#00247d"/>
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" stroke-width="3"/>
          <path d="M0,0 L30,20 M30,0 L0,20" clip-path="url(#t)" stroke="#cf142b" stroke-width="2"/>
          <path d="M15,0 v20 M0,10 h30" stroke="#fff" stroke-width="5"/>
          <path d="M15,0 v20 M0,10 h30" stroke="#cf142b" stroke-width="3"/>
        </svg>
      ),
    },
  ]

  return (
    <>
      <div
        className=" flex justify-between items-center px-[110px] w-full "
        style={{ backgroundColor: "#f1f2f4" }}
      >
        <div>
          <ul className="flex gap-[20px] items-center">
            {menuHeader.map((item, index) => {
              return (
                <li
                  key={index}
                  className="hover:border-blue-500 border-b-2 border-transparent py-2 text-1xl"
                  style={{ color: item.color }} // Thiết lập màu văn bản động
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = item.colorHover)
                  } // Đổi màu khi hover
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = item.color)
                  } // Quay về màu ban đầu khi rời hover
                >
                  <Link to={item.path}>{item.name}</Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="flex items-center gap-5 items-center ">
          <Image src={phoneCall} preview={false} />

          <p>+1-202-555-0178</p>

          <LanguageSelector />
        </div>
      </div>
      <div className=" flex justify-between items-center  w-full border-r-2 " > 
        <div className="flex items-center justify-start pl-[110px] py-5  border-b-2 w-full">
          <div className="flex  w-full items-center gap-[40px]">
            <div className="flex items-center gap-2">
              <Image src={icon} preview={false} />
              <h1 onClick={()=>navigate("/")} className="font-medium text-2xl cursor-pointer">MyJob</h1>
            </div>
            <div className="flex items-center gap-2 border-2 w-[60%] rounded-md">
            <Select
              bordered={false}
                  value={selectedLanguage}
                  style={{ width: 160 }}
                  onChange={handleChange}
                >
                  {languages.map((lang) => (
                  <Option key={lang.code} value={lang.code}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span style={{ 
                        marginRight: 8, 
                        display: 'inline-flex', 
                        alignItems: 'center',
                        border: '1px solid #d9d9d9',
                        borderRadius: '2px',
                        overflow: 'hidden'
                      }}>
                        {lang.flag}
                      </span>
                      {lang.name}
                    </div>
                  </Option>
                ))}
                </Select>
                <div className="w-[1px] h-[20px] bg-gray-300"></div>
              <div className="relative w-full">
                <SearchOutlined  className="absolute text-[20px] left-3 top-1/2 transform -translate-y-1/2 text-blue-500 z-10" />
                <Input 
                className="border-0 focus:border-0 focus:ring-0"
                  size="large" 
                  placeholder="Job tittle, keyword, company" 
                  style={{ paddingLeft: '40px' }} 
                />
              </div>
            </div>
          </div>

          <div className="flex gap-[10px]  items-center pr-[110px]">
            <Button size="large"  className="rounded">Sign In</Button>
            <Button size="large" type="primary" className="rounded">Post a Jobs</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
