import { useSelector } from "react-redux";
import { ROLE_NAME_ADMIN, ROLE_NAME_USER } from "../../utils/role.utils";
import DashBoardCandidate from "./candidate";
import DashBoardEmployer from "./employer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashBoardAdmin from "./admin";

const DashBoard = () => {
  const userDetail = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userDetail?.access_token) {
      navigate("/");
      return;
    }
  }, []);

  return (
    <>
      {userDetail.role?.role_name === ROLE_NAME_USER ? (
        <DashBoardCandidate />
      ) : userDetail.role?.role_name === ROLE_NAME_ADMIN ? (
        <DashBoardAdmin />
      ) : (
        <DashBoardEmployer />
      )}
    </>
  );
};

export default DashBoard;
