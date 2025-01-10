import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { menuHeader } from "../../helper";
import "react-phone-input-2/lib/style.css";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Empty,
  Image,
  notification,
  Popover,
  Spin,
} from "antd";
import avtDefault from "../../assets/avatars/avatar-default.jpg";
import { useSelector } from "react-redux";
import logo from "../../assets/logo/LogoH.png";
import { Bell, ChevronDown, ChevronUp, Menu as HamburgerMenu, Menu } from "lucide-react";
import Setting from "../Setting/Setting";
import "./styles.css";
import {
  ROLE_NAME_ADMIN,
  ROLE_NAME_EMPLOYEE,
  ROLE_NAME_USER,
} from "../../utils/role.utils";
import moment from "moment";
import { io } from "socket.io-client";
import { NOTIFICATION_API } from "../../services/modules/NotificationService";

const Header: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // New state to manage the menu visibility
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.user);
  const [socket, setSocket] = useState<any>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const getNotificationsForCandidate = async () => {
    try {
      const res = await NOTIFICATION_API.getNotificationsForCandidate(userDetail?._id, userDetail?.access_token);
      if (res.data) {
        setNotifications(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userDetail?.access_token) {
      getNotificationsForCandidate();
    }
  }, []);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_SOCKET, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("notification", (data: any) => {
      getNotificationsForCandidate();
    });

    newSocket.on("connect", () => {
      newSocket.emit("joinRoom", { userId: userDetail?._id });
    });

    newSocket.on("connect_error", (err: any) => {
      console.error("Connection error:", err);
    });

    newSocket.on("error", (err: any) => {
      console.error("Socket error:", err);
    });

    return () => {
      newSocket.close();
    };
  }, [userDetail]);

  const onReaded = async (notificationIds: string[]) => {
    const result = await NOTIFICATION_API.markAsRead(notificationIds, userDetail?.access_token);
    if (result) {
      setNotifications((prevState) =>
        prevState.map((notification) =>
          notificationIds.includes(notification._id)
            ? { ...notification, isRead: true }
            : notification
        )
      );
    }
  };

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
                Mã ứng viên:
                <span className="text-black">{userDetail?._id}</span>
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
              src={userDetail?.avatar_company || userDetail?.avatar || avtDefault}
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
                Mã quản trị viên:
                <span className="text-black">{userDetail?._id}</span>
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

  const handleClick = (item: any) => {
    if (item.name === "Dashboard") {
      navigate(`/dashboard/${userDetail?._id || userDetail?._id}`);
    } else {
      navigate(`${item.path}`);
    }
  };

  const renderNotifications = () => {
    return (
      <div className="min-w-min max-w-sm bg-white rounded-lg w-[250px]">
        <div className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="text-[12px] font-bold">Thông báo</div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => onReaded(unreadNotifications.map((notification) => notification._id))}
              className="text-green-600 text-[12px] border-none hover:text-green-700 p-0"
            >
              Đánh dấu là đã đọc
            </Button>
          </div>
        </div>
        <div className="max-h-[300px] w-full overflow-y-auto">
          <div className="space-y-2">
            {notifications.length > 0 ? (
              notifications?.map((notification) => (
                <div
                  key={notification?._id}
                  className="rounded-lg bg-slate-50 p-3 hover:bg-slate-100 transition-colors cursor-pointer px-2"
                >
                  <h3 className="font-semibold text-slate-900 text-[10px]">
                    {notification.message}
                  </h3>
                  <div className="flex justify-between items-center">
                    <p className="mt-2 text-[10px] text-slate-500">
                      {moment(notification.createdAt).fromNow()}
                    </p>
                    <p className="mt-2 text-[10px] text-slate-500">
                      {notification.isRead ? 'Đã xem' : ''}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <Empty />
            )}
          </div>
        </div>
      </div>
    );
  };

  const unreadNotifications = notifications.filter((notification) => !notification.isRead);

  return (
    <header>
      <div
        className="justify-between items-center md:px-4 lg:px-primary w-full sticky md:flex"
        style={{ backgroundColor: "black" }}
      >
        <div className="flex justify-center items-center gap-2">
          <Avatar shape="circle" src={logo} size={45} />
          <p className="text-white font-bold md:hidden lg:block">HireDev</p>
        </div>

        {/* Hamburger Menu for Small Screens */}
        <div className="md:hidden flex items-center gap-4">
          <Menu
            size={30}
            className="text-white cursor-pointer"
            onClick={() => setMenuVisible(!menuVisible)}
          />
        </div>

        {/* Menu */}
        {menuVisible && (
          <ul className="flex gap-[20px] md:gap-5 items-center flex-col flex-wrap py-2 w-full bg-black md:hidden">
            {menuHeader.map((item, idx) => {
              if (item.id === "dashboard" && !userDetail.access_token) {
                return null; 
              }
              if (item.id === "profile_cv" && !userDetail.access_token) {
                return null;
              }
              if (
                item.id === "profile_cv" &&
                userDetail?.role?.role_name === "EMPLOYER"
              ) {
                return null;
              }
              return (
                <li key={idx}>
                  <div
                    onClick={() => handleClick(item)}
                    className="text-white transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4D7D] to-[#FF7A5C] cursor-pointer"
                  >
                    {item.name}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <ul className="flex gap-[20px] md:gap-5 items-center flex-wrap py-2 hidden md:flex">
          {menuHeader.map((item, idx) => {
            if (item.id === "dashboard" && !userDetail.access_token) {
              return null;
            }
            if (item.id === "profile_cv" && !userDetail.access_token) {
              return null;
            }
            if (
              item.id === "profile_cv" &&
              userDetail?.role?.role_name === "EMPLOYER"
            ) {
              return null;
            }
            return (
              <li key={idx}>
                <div
                  onClick={() => handleClick(item)}
                  className="text-white transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4D7D] to-[#FF7A5C] cursor-pointer"
                >
                  {item.name}
                </div>
              </li>
            );
          })}
        </ul>

        <div>
          {userDetail.access_token ? (
            <>
              <Popover
                placement="bottomLeft"
                overlayClassName="no-arrow"
                opened={hovered}
                content={content}
                onVisibleChange={() => setHovered(!hovered)}
              >
                <div className="w-full flex items-center justify-center">
                  <Avatar size="large" src={userDetail?.avatar || avtDefault} />
                  <ChevronDown className="cursor-pointer text-white" size={20} />
                </div>
              </Popover>
            </>
          ) : (
            <Button onClick={() => navigate("/login")}>Đăng nhập</Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
