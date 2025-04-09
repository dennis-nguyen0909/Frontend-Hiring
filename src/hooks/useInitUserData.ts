// hooks/useInitUserData.ts
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { getDetailUser, USER_API } from "../services/modules/userServices";
import { ROLE_API } from "../services/modules/RoleServices";
import { handleDecoded } from "../helper";
import { updateUser } from "../redux/slices/userSlices";

export const useInitUserData = () => {
  const [visibleModalRole, setVisibleModalRole] = useState(false);
  const [visibleSetupModal, setVisibleSetupModal] = useState(false);
  const [activeTab, setActiveTab] = useState("company");
  const [roles, setRoles] = useState([]);
  const [selectedType, setSelectedType] = useState<"user" | "employer" | null>(
    null
  );

  const userDetail = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location.state || {};

  const handleGetDetailUser = async (userId: string, access_token: string) => {
    try {
      const refresh_token = localStorage.getItem("refresh_token") || "";
      const res = await getDetailUser(userId, access_token);
      if (res.data.items) {
        dispatch(
          updateUser({
            id: res.data.items._id,
            ...res.data.items,
            access_token,
            refresh_token,
          })
        );
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("refresh_token", refresh_token);
      }
    } catch (error: any) {
      notification.error({
        message: "Failed to fetch user details",
        description: error.message,
      });
    }
  };

  const afterLoginGoogleFacebook = async (accessToken: string) => {
    const { token, decoded } = handleDecoded(accessToken);
    await handleGetDetailUser(decoded?.sub + "", token);
    window.history.replaceState(null, "", window.location.pathname);
  };

  const handleCheckUpdate = async () => {
    try {
      const res = await USER_API.checkUpdateCompany(
        userId || userDetail?._id,
        userDetail?.access_token
      );
      if (res.data) {
        const progress = res.data.progress_setup;
        if (res.data.role.role_name === "EMPLOYER") {
          if (!progress.company_info) setActiveTab("company");
          else if (!progress.founding_info) setActiveTab("founding");
          else if (!progress.social_info) setActiveTab("social");
          else if (!progress.contact) setActiveTab("contact");
          else {
            setVisibleSetupModal(false);
            navigate("/");
            return;
          }
          setVisibleSetupModal(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckRole = async () => {
    try {
      const res = await USER_API.getDetailUser(
        userDetail?._id,
        userDetail?.access_token
      );
      const role = res?.data?.items?.role;
      if (!role) setVisibleModalRole(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGetRole = async () => {
    const res = await ROLE_API.getAll(userDetail?.access_token);
    setRoles(res.data?.items || []);
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    if (accessToken && refreshToken) {
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      afterLoginGoogleFacebook(accessToken);
    }
  }, []);

  useEffect(() => {
    if (userDetail?.access_token) {
      handleCheckRole();
      handleCheckUpdate();
      handleGetRole();
      handleGetDetailUser(userId || userDetail?._id, userDetail?.access_token);
    }
  }, [userDetail?.access_token]);

  return {
    visibleSetupModal,
    visibleModalRole,
    activeTab,
    roles,
    selectedType,
    setVisibleSetupModal,
    setVisibleModalRole,
    setActiveTab,
    setSelectedType,
    handleGetDetailUser,
    handleGetRole,
  };
};
