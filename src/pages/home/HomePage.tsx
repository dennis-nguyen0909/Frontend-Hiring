import TopCompanies from "../../components/ui/TopCompanies";
import FeatureJobV2 from "../FeatureJob/FeatureJobV2";
import IntroduceV2 from "../introduce/IntroduceV2";
const HomePage = () => {
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
