import { useSelector } from "react-redux";
import { ROLE_NAME_ADMIN, ROLE_NAME_USER } from "../../utils/role.utils";
import DashBoardCandidate from "./candidate";
import DashBoardEmployer from "./employer";
import { USER_API } from "../../services/modules/userServices";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashBoardAdmin from "./admin";

const DashBoard = () => {
  const { id } = useParams();
  const userDetail = useSelector((state: any) => state.user);
  const [user, setUser] = useState<any>();
  const navigate = useNavigate();

  const handleGetDetailUser = async () => {
    try {
      const res = await USER_API.getDetailUser(id + "");
      if (res.data.items) {
        setUser(res.data.items);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!userDetail?.access_token) {
      navigate("/");
      return;
    }
    handleGetDetailUser();
  }, [userDetail, navigate]);

  return (
    <div>
      {user?.role?.role_name === ROLE_NAME_USER ? (
        <DashBoardCandidate />
      ) : user?.role?.role_name === ROLE_NAME_ADMIN ? (
        <DashBoardAdmin />
      ) : (
        <DashBoardEmployer />
      )}
    </div>
  );
};

export default DashBoard;
