import PopularCategory from "../../components/PopularCategory.tsx/PopularCategory";
import JobWork from "../../components/ui/JobWork";
import TopCompanies from "../../components/ui/TopCompanies";

import FeatureJob from "../FeatureJob/FeatureJob";
import FeatureJobV2 from "../FeatureJob/FeatureJobV2";
import Introduce from "../introduce/Introduce";
import IntroduceV2 from "../introduce/IntroduceV2";

const HomePage = () => {
  return (
   <>
    <IntroduceV2 />
    {/* <Puporlar /> */}
    {/* <JobWork /> */}
    {/* <PopularCategory /> */}
    <FeatureJobV2 />
    <TopCompanies />
   </>
  );
};

export default HomePage;
