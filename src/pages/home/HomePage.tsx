import PopularCategory from "../../components/PopularCategory.tsx/PopularCategory";
import JobWork from "../../components/ui/JobWork";
import FeatureJob from "../FeatureJob/FeatureJob";
import Introduce from "../introduce/Introduce";
import Puporlar from "../puporlar/PuporlarPage";
const HomePage = () => {
  return (
   <>
    <Introduce />
    {/* <Puporlar /> */}
    <JobWork />
    <PopularCategory />
    <FeatureJob />
   </>
  );
};

export default HomePage;
