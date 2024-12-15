import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { menuHeader } from "../../helper";
import "react-phone-input-2/lib/style.css";
import { Avatar, Button, Divider, Image, Popover, Spin } from "antd";
import avtDefault from "../../assets/avatars/avatar-default.jpg";
import { useSelector } from "react-redux";
import logo from "../../assets/logo/LogoH.png";
import { ChevronDown, ChevronUp } from "lucide-react";
import Setting from "../Setting/Setting";
import "./styles.css";
import {
  ROLE_NAME_ADMIN,
  ROLE_NAME_EMPLOYEE,
  ROLE_NAME_USER,
} from "../../utils/role.utils";
import { ROLE_API } from "../../services/modules/RoleServices";
const Header: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.user);
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
  const renderAccountHeader = (roleName: string) => {
    return (
      <div>
        {roleName === ROLE_NAME_USER ? (
          <div className="flex">
            <Avatar size="large" src={userDetail?.avatar || avtDefault} />
            <div className="ml-5">
              <p className="font-semibold text-[14px] text-primaryColor ">
                {userDetail?.full_name}
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                Mã ứng viên:<span className="text-black">{userDetail?._id}</span>
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                Email: {userDetail?.email}
              </p>
            </div>
          </div>
        ) : roleName === ROLE_NAME_EMPLOYEE ? (
          <div className="flex">
            <Avatar
              size="large"
              src={userDetail?.avatar || userDetail?.avatar_company || avtDefault}
            />
            <div className="ml-5">
              <p className="font-semibold text-[14px] text-primaryColor ">
                {userDetail?.full_name}
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                Mã nhà tuyển dụng:
                <span className="text-black">{userDetail?._id}</span>
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                Email: {userDetail?.email}
              </p>
            </div>
          </div>
        ) : roleName === ROLE_NAME_ADMIN ? (
          <div>
            <Avatar size="large" src={userDetail?.avatar || avtDefault} />
            <div className="ml-5">
              <p className="font-semibold text-[14px] text-primaryColor ">
                {userDetail?.full_name}
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                Mã quản trị viên:<span className="text-black">{userDetail?._id}</span>
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                Email: {userDetail?.email}
              </p>
            </div>
          </div>
        ) : (
          <div>Không có quyền</div>
        )}
      </div>
    );
  };
  const content = (
    <div className="w-[400px]">
      <div className="flex items-center">
        {userDetail?.role?.role_name ? (
          renderAccountHeader(userDetail?.role?.role_name)
        ) : (
          <Spin />
        )}
      </div>
      <Divider />
      <div className="menu-setting">
        <Setting />
      </div>
    </div>
  );
  const handleClick = (item) => {
    // navigate(`${item.path}`)
    if (item.name === "Dashboard") {
      navigate(`/dashboard/${userDetail?._id || userDetail?._id}`);
    } else {
      navigate(`${item.path}`);
    }
  };
  return (
    <header>
      <div
        className=" justify-between items-center px-primary w-full sticky hidden md:flex"
        style={{ backgroundColor: "black" }}
      >
        <div className="flex justify-center items-center">
          <Image src={logo} preview={false} width={64} height={64} />
          <p className="text-white  font-bold">HireDev</p>
        </div>
        <ul className="flex gap-[20px] md:gap-5 items-center flex-wrap">
          {menuHeader.map((item, idx) => {
            if (item.id === "dashboard" && !userDetail.access_token) {
              return null; // Không hiển thị Dashboard nếu không có access_token
            }
            if (item.id === "profile_cv" && !userDetail.access_token) {
              return null;
            }
            if(item.id === 'profile_cv' && userDetail?.role?.role_name === 'EMPLOYER'){
              return null;
            }
            return (
              <li key={idx}>
                {item.candidate === true ? (
                  <div
                    onClick={() => handleClick(item)}
                    className="text-white transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4D7D] to-[#FF7A5C] cursor-pointer"
                  >
                    {item.name}
                  </div>
                ) : item.employer === true ? (
                  <div
                    onClick={() => handleClick(item)}
                    className="text-white transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4D7D] to-[#FF7A5C] cursor-pointer"
                  >
                    {item.name}
                  </div>
                ) : (
                  <div
                    onClick={() => handleClick(item)}
                    className="text-white transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4D7D] to-[#FF7A5C] cursor-pointer"
                  >
                    {item.name}
                  </div>
                )}
              </li>
            );
          })}
          <div>
            {userDetail.access_token ? (
              <Popover
                placement="bottomLeft"
                overlayClassName="no-arrow"
                opened={hovered}
                content={content}
              >
                <li
                  className="relative w-[90px] bg-white rounded-full py-1 px-1 flex items-center justify-between cursor-pointer"
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                >
                  <Avatar
                    size="large"
                    src={userDetail?.avatar || userDetail?.avatar_company || avtDefault}
                  />
                  {!hovered ? <ChevronDown /> : <ChevronUp />}
                </li>
              </Popover>
            ) : (
              <div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-200 hover:!text-black"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                    style={{ backgroundColor: "#d64453" }}
                    className="text-white outline-none border-none hover:!text-black"
                  >
                    Register
                  </Button>
                </div>
              </div>
            )}
          </div>
        </ul>
      </div>
    </header>
  );
};

export default Header;
