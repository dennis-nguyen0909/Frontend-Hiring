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
import { Bell, ChevronDown, ChevronUp } from "lucide-react";
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
interface INotification {
  _id: string;
  candidateId: any; // Ứng viên
  employerId: any; // Nhà tuyển dụng
  applicationId: any; // Đơn ứng tuyển
  jobId: any; // Công việc
  message: string; // Tin nhắn thông báo
  isRead: boolean; // Trạng thái đã đọc
  createdAt: Date; // Thời gian tạo thông báo
}

const Header: React.FC = () => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const userDetail = useSelector((state) => state.user);
  const [socket, setSocket] = useState<any>(null);
  const [notifications,setNotifications]=useState<INotification[]>([])
  const getNotificationsForCandidate=async()=>{
    try {
      const res = await NOTIFICATION_API.getNotificationsForCandidate(userDetail?._id,userDetail?.access_token);
      if(res.data){
        setNotifications(res.data.items)
      }
    } catch (error) {
      console.error(error);
    }
  }
  useEffect(()=>{
    if(userDetail?.access_token){
      getNotificationsForCandidate()
    }
  },[])

  useEffect(() => {
    // Thiết lập kết nối với WebSocket server (NestJS)
    const newSocket = io(import.meta.env.VITE_API_SOCKET, {
      transports: ["websocket"], // Chỉ định sử dụng WebSocket
    });
    setSocket(newSocket);
    console.log("Socket created:", newSocket);

    newSocket.on("notification", (data: any) => {
      getNotificationsForCandidate()
    });

    newSocket.on("connect", () => {
      // Giả sử userId là 123
      newSocket.emit("joinRoom", { userId: userDetail?._id });
      console.log("Client joined room with userId:", userDetail?._id);
    });
    // Lắng nghe sự kiện lỗi kết nối
    newSocket.on("connect_error", (err: any) => {
      console.error("Connection error:", err);
    });

    newSocket.on("error", (err: any) => {
      console.error("Socket error:", err);
    });

    return () => {
      newSocket.close();
    };
  }, []);
  const onReaded = async (notificationIds: string[]) => {
    const result = await NOTIFICATION_API.markAsRead(notificationIds, userDetail?.access_token);
    if (result) {
      setNotifications(prevState =>
        prevState.map(notification =>
          notificationIds.includes(notification._id) ? { ...notification, isRead: true } : notification
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
              src={
                userDetail?.avatar_company || userDetail?.avatar || avtDefault
              }
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
  const handleClick = (item) => {
    // navigate(`${item.path}`)
    if (item.name === "Dashboard") {
      navigate(`/dashboard/${userDetail?._id || userDetail?._id}`);
    } else {
      navigate(`${item.path}`);
    }
  };

  const renderNotifications = () => {
    return (
      <div className="min-w-min max-w-sm  bg-white rounded-lg  w-[250px]">
        <div className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="text-[12px] font-bold ">Thông báo</div>
          <div className="flex items-center gap-2">
            <Button onClick={() => onReaded(unreadNotifications.map(notification => notification._id))} className="text-green-600 text-[12px] border-none hover:text-green-700 p-0">
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
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-[10px] text-slate-700">
                    {notification.message}
                  </p>
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
  const unreadNotifications = notifications.filter(notification => !notification.isRead);
  return (
    <header>
      <div
        className="justify-between items-center md:px-4 lg:px-primary w-full sticky hidden md:flex"
        style={{ backgroundColor: "black" }}
      >
        <div className="flex justify-center items-center">
          <Image src={logo} preview={false} width={64} height={64} />
          <p className="text-white font-bold  md:hidden lg:block">HireDev</p>
        </div>
        <ul className="flex gap-[20px] md:gap-5 items-center flex-wrap">
          {menuHeader.map((item, idx) => {
            if (item.id === "dashboard" && !userDetail.access_token) {
              return null; // Không hiển thị Dashboard nếu không có access_token
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
          {userDetail?.access_token && 
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
                <Bell size={20} className="text-2xl cursor-pointer text-white hover:text-blue-500" />
              </Badge>
            </Popover>
          </li>
            }

          <div>
            {userDetail.access_token ? (
              <>
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
                      src={
                        userDetail?.avatar_company ||
                        userDetail?.avatar ||
                        avtDefault
                      }
                    />
                    {!hovered ? <ChevronDown /> : <ChevronUp />}
                  </li>
                </Popover>
              </>
            ) : (
              <div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => navigate("/login")}
                    variant="outline"
                    className="bg-white text-black hover:bg-gray-200 hover:!text-black"
                  >
                    Đăng nhập
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                    style={{ backgroundColor: "#d64453" }}
                    className="text-white outline-none border-none hover:!text-black"
                  >
                    Đăng ký
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
