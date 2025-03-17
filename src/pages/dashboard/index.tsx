import { useSelector } from "react-redux";
import { ROLE_NAME_ADMIN, ROLE_NAME_USER } from "../../utils/role.utils";
import DashBoardCandidate from "./candidate";
import DashBoardEmployer from "./employer";
import { USER_API } from "../../services/modules/userServices";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DashBoardAdmin from "./admin";
import { Spin } from "antd";

interface User {
  role?: {
    role_name: string;
  };
}

const DashBoard = () => {
  const { id } = useParams();
  const userDetail = useSelector((state: any) => state.user);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const handleGetDetailUser = async () => {
    try {
      setIsLoading(true);
      const res = await USER_API.getDetailUser(id + "");
      if (res.data.items) {
        setUser(res.data.items);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!userDetail?.access_token) {
      navigate("/");
      return;
    }
    handleGetDetailUser();
  }, [userDetail, navigate]);

  if (!user) {
    return <div>No user data found</div>;
  }

  return (
    <>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <div>
          {user.role?.role_name === ROLE_NAME_USER ? (
            <DashBoardCandidate />
          ) : user.role?.role_name === ROLE_NAME_ADMIN ? (
            <DashBoardAdmin />
          ) : (
            <DashBoardEmployer />
          )}
        </div>
      )}
    </>
  );
};

export default DashBoard;
