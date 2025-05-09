import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { menuHeader } from "../../helper";
import "react-phone-input-2/lib/style.css";
import {
  Avatar,
  Badge,
  Button,
  Divider,
  Empty,
  notification,
  Popover,
  Spin,
} from "antd";
import avtDefault from "../../assets/avatars/avatar-default.jpg";
import { useSelector } from "react-redux";
import logo from "../../assets/logo/LogoH.png";
import { Bell, ChevronDown, Menu } from "lucide-react";
import Setting from "../Setting/Setting";
import "./styles.css";
import {
  ROLE_NAME_ADMIN,
  ROLE_NAME_EMPLOYEE,
  ROLE_NAME_USER,
} from "../../utils/role.utils";
import { io } from "socket.io-client";
import { NOTIFICATION_API } from "../../services/modules/NotificationService";
import { INotification } from "../ui/NotificationModal";
import * as authServices from "../../services/modules/authServices";
import { resetUser } from "../../redux/slices/userSlices";
import { useDispatch } from "react-redux";
import ButtonComponent from "../Button/ButtonComponent";
import useMomentFn from "../../hooks/useMomentFn";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../LanguagesSwitch/LanguagesSwitch";
const Header: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false); // New state to manage the menu visibility
  const [activeMenu, setActiveMenu] = useState(menuHeader[0]?.path || "");
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.user);
  const [socket, setSocket] = useState<any>(null);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [notificationsVisible, setNotificationsVisible] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const { formatDate } = useMomentFn();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const changeLanguage = (language: "en" | "vi") => {
    i18n.changeLanguage(language);
  };
  const getNotificationsForCandidate = async () => {
    try {
      const res = await NOTIFICATION_API.getNotificationsForCandidate(
        userDetail?._id,
        userDetail?.access_token
      );
      if (res.data) {
        setNotifications(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getNotificationsForEmployer = async () => {
    try {
      const res = await NOTIFICATION_API.getNotificationsForEmployer(
        userDetail?._id,
        userDetail?.access_token
      );
      if (res.data) {
        setNotifications(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (userDetail?.access_token) {
      if (userDetail?.role?.role_name === ROLE_NAME_USER) {
        getNotificationsForCandidate();
      } else if (userDetail?.role?.role_name === ROLE_NAME_EMPLOYEE) {
        getNotificationsForEmployer();
      }
    }
  }, [userDetail?.access_token, userDetail?.role?.role_name]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_API_SOCKET, {
      transports: ["websocket"],
    });
    setSocket(newSocket);

    newSocket.on("notification", (data: any) => {
      getNotificationsForCandidate();
    });

    newSocket.on("notification-employer", (data: any) => {
      getNotificationsForEmployer();
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
    const result = await NOTIFICATION_API.markAsRead(
      notificationIds,
      userDetail?.access_token
    );
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
                {t("candidate_code")}:
                <span className="text-black">{userDetail?._id}</span>
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                {t("email")}: {userDetail?.email}
              </p>
            </div>
          </div>
        ) : roleName === ROLE_NAME_EMPLOYEE ? (
          <div className="flex">
            <Avatar
              size="large"
              src={
                userDetail?.avatar_company || userDetail?.avatar || avtDefault
              }
            />
            <div className="ml-5">
              <p className="font-semibold text-[14px] text-primaryColor ">
                {userDetail?.full_name}
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                {t("employer_code")}:
                <span className="text-black">{userDetail?._id}</span>
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                {t("email")}: {userDetail?.email}
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
                {t("admin_code")}:
                <span className="text-black">{userDetail?._id}</span>
              </p>
              <p className="font-light text-[12px] text-[#ccc]">
                {t("email")}: {userDetail?.email}
              </p>
            </div>
          </div>
        ) : (
          <div>{t("no_permission")}</div>
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

  useEffect(() => {
    if (location.pathname.startsWith("/dashboard")) {
      setActiveMenu("/dashboard/:id");
    } else {
      setActiveMenu(location.pathname);
    }
  }, [location.pathname]);

  const handleClick = (item: any) => {
    if (item?.name === "Dashboard") {
      navigate(`/dashboard/${userDetail?._id}`);
    } else {
      navigate(`${item.path}`);
    }
    setActiveMenu(item.path);
  };

  const handleLogout = async () => {
    try {
      const res = await authServices.logout(userDetail?.access_token);
      if (res.data === true) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        dispatch(resetUser());
        navigate("/");
        notification.success({
          message: t("notification"),
          description: t("logout_success"),
        });
      }
    } catch (error) {
      notification.error({
        message: t("notification"),
        description: error.message,
      });
      console.error("Đăng xuất thất bại:", error);
    }
  };
  const renderNotifications = () => {
    return (
      <div className="lg:min-w-min lg:max-w-sm bg-white lg:rounded-lg lg:w-[250px] w-full shadow">
        <div
          className="flex flex-row items-center justify-between space-y-0 lg:pb-3 px-6"
          style={{ borderBottom: "1px solid #ccc" }}
        >
          <div className="text-[12px] font-bold">{t("notification")}</div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() =>
                onReaded(
                  unreadNotifications.map((notification) => notification._id)
                )
              }
              className="text-green-600 text-[12px] border-none hover:text-green-700 p-0"
            >
              {t("mark_as_read")}
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
                      {formatDate(notification.createdAt)}
                    </p>
                    <p className="mt-2 text-[10px] text-slate-500">
                      {notification.isRead ? t("read") : ""}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("no_notification")}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const unreadNotifications = notifications.filter(
    (notification) => !notification.isRead
  );
  const openNotifications = () => {
    setNotificationsVisible(!notificationsVisible);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 678) {
        setNotificationsVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <header>
      <div
        className="justify-between items-center md:px-4 w-full sticky md:flex"
        style={{ backgroundColor: "black" }}
      >
        <div className="flex justify-between mx-5">
          <div
            className="flex justify-center items-center gap-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <Avatar shape="circle" src={logo} size={50} />
            <p className="text-white font-bold text-[20px] md:text-[24px] lg:text-[28px] hidden md:block">
              HireDev
            </p>
          </div>

          {/* Hamburger Menu for Small Screens */}
          <div className="md:hidden flex items-center gap-4">
            {userDetail?.access_token && (
              <Badge
                onClick={() => openNotifications()}
                className="custom-badge"
                count={unreadNotifications.length}
                overflowCount={99}
              >
                <Bell
                  size={20}
                  className="text-2xl cursor-pointer text-white hover:text-blue-500"
                />
              </Badge>
            )}
            <Menu
              size={30}
              className="text-white cursor-pointer"
              onClick={() => setMenuVisible(!menuVisible)}
            />
          </div>
        </div>

        {/* Menu */}
        {menuVisible && (
          <ul
            className={`
           flex flex-col flex-wrap items-center w-full py-2 
           gap-[16px] text-sm md:text-base 
           bg-black md:hidden
         `}
          >
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
                    className={`
                    relative cursor-pointer 
                    transition-all duration-300 
                    transform hover:scale-105 
                    !w-[200px]
                    text-center
                    ${
                      activeMenu === item.path
                        ? "text-white bg-gradient-to-r from-[#da4156] to-[#ff7a5c] shadow-lg shadow-[#da4156]/50 rounded-xl p-2"
                        : "text-gray-400 hover:text-white hover:bg-clip-text hover:bg-gradient-to-r from-[#da4156] to-[#ff7a5c]"
                    }
                  `}
                  >
                    <span className="relative z-10">{t(item.id)}</span>
                  </div>
                </li>
              );
            })}
            {!userDetail?.access_token && (
              <>
                <li
                  className="block md:hidden"
                  onClick={() => navigate("/login")}
                >
                  <ButtonComponent onClick={() => navigate("/login")}>
                    {t("login")}
                  </ButtonComponent>
                </li>
                <li
                  className="block md:hidden"
                  onClick={() => navigate("/register")}
                >
                  <div className="text-white transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4D7D] to-[#FF7A5C] cursor-pointer">
                    {t("register")}
                  </div>
                </li>
              </>
            )}
            {userDetail?.access_token && (
              <li className="block md:hidden" onClick={handleLogout}>
                <div className="text-white transition-colors duration-200 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r from-[#FF4D7D] to-[#FF7A5C] cursor-pointer">
                  {t("logout")}
                </div>
              </li>
            )}
          </ul>
        )}
        {notificationsVisible && (
          <div
            className={`${
              notificationsVisible
                ? "translate-y-0 opacity-100"
                : "-translate-y-full opacity-0"
            } transition-all duration-500 ease-out lg:min-w-min lg:max-w-sm bg-white lg:rounded-lg lg:w-[250px] w-full shadow`}
          >
            {renderNotifications()}
          </div>
        )}

        <ul className="text-[15px] font-medium gap-[20px] md:gap-5 items-center flex-wrap py-1 hidden md:flex">
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
                  className={`
                    relative cursor-pointer 
                    transition-all duration-300 
                    transform hover:scale-105 
                    ${
                      activeMenu === item.path
                        ? "text-white bg-gradient-to-r from-[#da4156] to-[#ff7a5c] shadow-lg shadow-[#da4156]/50 rounded-xl p-2"
                        : "text-gray-400 hover:text-white hover:bg-clip-text hover:bg-gradient-to-r from-[#da4156] to-[#ff7a5c]"
                    }
                  `}
                >
                  <span className="relative z-10">{t(item.id)}</span>
                </div>
              </li>
            );
          })}
          {userDetail?.access_token && (
            <li className="relative mt-[2px]">
              <Popover
                content={renderNotifications}
                trigger="hover"
                placement="bottom"
              >
                <Badge
                  className="custom-badge"
                  count={unreadNotifications.length}
                  overflowCount={99}
                >
                  <Bell
                    size={20}
                    className="text-2xl cursor-pointer text-white hover:text-blue-500"
                  />
                </Badge>
              </Popover>
            </li>
          )}
        </ul>

        <div className="hidden md:flex items-center gap-6 ">
          <LanguageSwitch />
          {userDetail.access_token ? (
            <>
              <Popover
                placement="bottomLeft"
                overlayClassName="no-arrow"
                // opened={hovered}
                content={content}
                onVisibleChange={() => setHovered(!hovered)}
              >
                <div className="w-full flex items-center justify-center">
                  <Avatar
                    size="large"
                    src={
                      userDetail?.avatar_company ||
                      userDetail?.banner_company ||
                      userDetail?.avatar ||
                      avtDefault
                    }
                  />
                  <ChevronDown
                    className="cursor-pointer text-white"
                    size={20}
                  />
                </div>
              </Popover>
            </>
          ) : (
            <div className="flex gap-2">
              <ButtonComponent onClick={() => navigate("/login")}>
                {t("login")}
              </ButtonComponent>
              <ButtonComponent onClick={() => navigate("/register")}>
                {t("register")}
              </ButtonComponent>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
