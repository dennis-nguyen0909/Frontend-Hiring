import { useSelector } from "react-redux";
import TopCompanies from "../../components/ui/TopCompanies";
import FeatureJobV2 from "../FeatureJob/FeatureJobV2";
import IntroduceV2 from "../introduce/IntroduceV2";
import SuggestionJob from "./SuggestionJob/SuggestionJob";
const HomePage = () => {
  const userDetail = useSelector(state=>state.user);
  return (
   <>
    <IntroduceV2 />
    {/* <PopularCategory /> */}
    {userDetail.is_suggestion_job && <SuggestionJob />}
    <FeatureJobV2 />
    <TopCompanies />
   </>
  );
};

export default HomePage;
