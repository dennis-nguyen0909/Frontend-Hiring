import PopularCategory from "../../components/PopularCategory.tsx/PopularCategory";
import JobWork from "../../components/ui/JobWork";
import TopCompanies from "../../components/ui/TopCompanies";

import FeatureJob from "../FeatureJob/FeatureJob";
import Introduce from "../introduce/Introduce";

const HomePage = () => {
  return (
   <>
    <Introduce />
    {/* <Puporlar /> */}
    <JobWork />
    <PopularCategory />
    <FeatureJob />
    <TopCompanies />
   </>
  );
};

export default HomePage;
