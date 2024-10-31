import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { menuHeader } from "../../helper";
import "react-phone-input-2/lib/style.css";
import { Avatar, Button, Divider, Image, Popover } from "antd";
import avtDefault from '../../assets/avatars/avatar-default.jpg'
import { useSelector } from "react-redux";
import logo from "../../assets/logo/LogoH.png";
import { ChevronDown, ChevronUp } from "lucide-react";
import Setting from "../Setting/Setting";
import './styles.css'
const Header: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);


  const handleChange = (value: string) => {
    setSelectedLanguage(value);
  };
  const languages: any = [
    {
      code: "vi",
      name: "Tiếng Việt",
      flag: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="16"
          viewBox="0 0 30 20"
        >
          <rect width="30" height="20" fill="#DA251D" />
          <polygon
            points="15,4 11.47,14.85 20.71,8.15 9.29,8.15 18.53,14.85"
            fill="#FFFF00"
          />
        </svg>
      ),
    },
    {
      code: "en",
      name: "English",
      flag: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="16"
          viewBox="0 0 30 20"
        >
          <clipPath id="t">
            <path d="M15,10 h15 v10 z v-10 h-15 z h-15 v10 z v-10 h15 z" />
          </clipPath>
          <path d="M0,0 v20 h30 v-20 z" fill="#00247d" />
          <path d="M0,0 L30,20 M30,0 L0,20" stroke="#fff" stroke-width="3" />
          <path
            d="M0,0 L30,20 M30,0 L0,20"
            clip-path="url(#t)"
            stroke="#cf142b"
            stroke-width="2"
          />
          <path d="M15,0 v20 M0,10 h30" stroke="#fff" stroke-width="5" />
          <path d="M15,0 v20 M0,10 h30" stroke="#cf142b" stroke-width="3" />
        </svg>
      ),
    },
  ];
  
  const content = (
    <div className="w-[400px]">
                      <div className="flex items-center">
                          <Avatar size="large" src={avtDefault} />
                          <div className="ml-5">
                              <p className="font-semibold text-[14px] text-primaryColor ">{user?.full_name}</p>
                              <p className="font-light text-[12px] text-[#ccc]">Mã ứng viên:<span className="text-black">{user?._id}</span></p>
                              <p className="font-light text-[12px] text-[#ccc]">Email: {user?.email}</p>
                          </div>
                      </div>
                      <Divider />
                      <div className="menu-setting">
                            <Setting />
                      </div>

    </div>
  );


  return (
    <header>
      <div
        className=" justify-between items-center px-primary w-full py-3 sticky hidden md:flex"
        style={{ backgroundColor: "black" }}
      >
        <div className="flex justify-center items-center">
          <Image src={logo} preview={false} width={64} height={64} />
          <p className="text-white text-3xl font-bold">HireDev</p>
        </div>
        <ul className="flex gap-[20px] md:gap-5 items-center flex-wrap">
          {menuHeader.map((item, idx) => {
            return (
              <li key={idx}>
                <Link
                  to={`/${item.name.toLowerCase()}`}
                  className="text-white text-text-primary transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4D7D] to-[#FF7A5C]"
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
          <div>
            {user.access_token ? (
              <Popover
               placement="bottomLeft"
               overlayClassName="no-arrow"
               opened={hovered} content={content} >
                <li
                className="relative w-[90px] bg-white rounded-full py-1 px-1 flex items-center justify-between cursor-pointer"
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
              >
                <Avatar size="large" src={avtDefault} />
                {!hovered ? (
                  <ChevronDown />
                ) : (
                  <ChevronUp />
                )}
              </li>
              </Popover>
            ):(
              <div>
                 <div className="flex space-x-2">
                <Button onClick={() => navigate("/login")} variant="outline" className="bg-white text-black hover:bg-gray-200 hover:!text-black">
                  Login
                </Button>
                <Button onClick={() => navigate("/register")} style={{backgroundColor: "#d64453"}}  className="text-white outline-none border-none hover:!text-black">
                  Register
                </Button>
      </div>
                </div>
            )}
          </div>
        </ul>
        {/* <div className="flex items-center gap-5 ">
          <Image src={phoneCall} preview={false} />
          <p>+1-202-555-0178</p>
          <LanguageSelector />

              <div className="bg-[#ebf6f3] w-10 h-10 flex items-center justify-center rounded-full">
                <FontAwesomeIcon icon={faBell} className="text-white text-[23px]" />
              </div>
              
              <div className="bg-[#ebf6f3] w-10 h-10 flex items-center justify-center rounded-full">
                <FontAwesomeIcon icon={faComments} className="text-white text-[23px]" />
              </div>

              {user.access_token && (
                <div className="bg-[#ebf6f3] w-10 h-10 flex items-center justify-center rounded-full">
                  <Avatar size="small" icon={<UserOutlined />} />
                </div>
              )}
        </div>   */}
      </div>

      {/* Menu search bar */}
      {/* <div className=" flex justify-between items-center  w-full  border-r-2  ">
        <div
          className="flex items-center justify-start md:pl-primary py-5 w-full"
          style={{ borderBottom: "1px solid #e3e5e9" }}
        >
          <div className="flex  w-full items-center gap-[40px]  justify-between md:justify-start mx-5 md:mx-0">
            <div className="flex items-center gap-2">
              <Image src={icon} preview={false} />
              <span className="text-2xl font-bold bg-gradient-to-r from-[#FF4D7D] to-[#FF7A5C] text-transparent bg-clip-text">
                HireDev
              </span>
              <h1
                onClick={() => navigate("/")}
                className="font-medium text-2xl cursor-pointer"
              >
                MyJob
              </h1>
            </div>
            <div
              className="md:flex items-center gap-2 w-[60%] rounded-md hidden "
              style={{ border: "1px solid #e3e5e9" }}
            >
              <Select
                bordered={false}
                value={selectedLanguage}
                style={{ width: 160 }}
                onChange={handleChange}
              >
                {languages.map((lang) => (
                  <Option key={lang.code} value={lang.code}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{
                          marginRight: 8,
                          display: "inline-flex",
                          alignItems: "center",
                          border: "1px solid #d9d9d9",
                          borderRadius: "2px",
                          overflow: "hidden",
                        }}
                      >
                        {lang.flag}
                      </span>
                      {lang.name}
                    </div>
                  </Option>
                ))}
              </Select>
              <div className="w-[1px] h-[20px] bg-gray-300"></div>
              <div className="relative w-full">
                <SearchOutlined className="absolute text-[20px] left-3 top-1/2 transform -translate-y-1/2 text-blue-500 z-10" />
                <Input
                  className="border-0 focus:border-0 focus:ring-0"
                  size="large"
                  placeholder="Job tittle, keyword, company"
                  style={{ paddingLeft: "40px" }}
                />
              </div>
            </div>
            <div className="md:hidden flex ">
              <MenuOutlined style={{ fontSize: "24px" }} />
            </div>
          </div>

          <div className="gap-[10px]  items-center pr-primary hidden md:flex">
            <Button
              onClick={() => navigate("/login")}
              size="large"
              className="rounded"
            >
              Sign In
            </Button>
            <Button size="large" type="primary" className="rounded">
              Post a Jobs
            </Button>
          </div>
        </div>
      </div> */}
    </header>
  );
};

export default Header;
