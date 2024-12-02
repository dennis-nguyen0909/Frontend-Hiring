import { useSelector } from "react-redux";
import PopularCategory from "../../components/PopularCategory.tsx/PopularCategory";
import TopCompanies from "../../components/ui/TopCompanies";
import { USER_API } from "../../services/modules/userServices";
import FeatureJobV2 from "../FeatureJob/FeatureJobV2";
import IntroduceV2 from "../introduce/IntroduceV2";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  // const userDetail = useSelector(state=>state.user);
  // const navigate=useNavigate()
  // const handleCheckUpdate =async ()=>{
  //   try {
  //     const res = await USER_API.checkUpdateCompany(userDetail?._id,userDetail?.access_token);
  //     console.log("res",res?.data?.progress_setup)
  //     if(res.data){
  //       const {company_info,contact,founding_info,social_info} = res.data.progress_setup
  //       if(!company_info || !contact || !founding_info || !social_info){
  //         navigate('/account-setup')
  //       }
  //     }
  //   } catch (error) {
  //     console.error(error)
  //   }
  // }
  // useEffect(()=>{
  //   handleCheckUpdate();
  // },[])
  return (
   <>
    <IntroduceV2 />
    {/* <PopularCategory /> */}
    <FeatureJobV2 />
    <TopCompanies />
   </>
  );
};

export default HomePage;
