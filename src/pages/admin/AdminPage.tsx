import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const userDetail = useSelector((state) => state.user);
  const navigate = useNavigate();
  useEffect(() => {
    if (!userDetail?.access_token) {
      navigate("/");
    }
  }, [userDetail?.access_token]);
  return <div>AdminPage</div>;
};

export default AdminPage;
