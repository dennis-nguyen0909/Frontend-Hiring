import { useSelector } from "react-redux";
import { ROLE_NAME_USER } from "../../utils/role.utils";
import DashBoardCandidate from "./candidate";
import DashBoardEmployer from "./employer";
import { USER_API } from "../../services/modules/userServices";
import { useFetcher, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
const DashBoard = () => {
  const { id } = useParams();
  const [user, setUser] = useState();
  const handleGetDetailUser = async () => {
    try {
      const res = await USER_API.getDetailUser(id + "");
      if (res.data.items) {
        setUser(res.data.items);
      }
    } catch (error) {
        console.error(error)
    }
  };
  useEffect(() => {
    handleGetDetailUser();
  }, []);
  return (
    <div>
      {user?.role?.role_name === ROLE_NAME_USER ? (
        <DashBoardCandidate />
      ) : (
        <DashBoardEmployer />
      )}
    </div>
  );
};

export default DashBoard;
