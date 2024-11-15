import { useSelector } from "react-redux"
import { ROLE_NAME_USER } from "../../utils/role.utils";
import DashBoardCandidate from "./candidate";
import DashBoardEmployer from "./employer";

const DashBoard = ()=>{
    const userDetail = useSelector(state => state.user);
    return (
        <div>
            {userDetail?.role?.role_name === ROLE_NAME_USER ? (
                <DashBoardCandidate />
            ):(
                <DashBoardEmployer />
            )}
        </div>
    )
}

export default DashBoard