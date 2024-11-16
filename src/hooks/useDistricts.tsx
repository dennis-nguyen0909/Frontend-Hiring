import { useState, useEffect } from 'react';
import { CitiesAPI } from '../services/modules/citiesServices';
import { useSelector } from 'react-redux';

type District = {
    code :string;
    codename:string;
    name:string;
    _id:string
}
export const useDistricts = (cityId:string) => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const userDetail = useSelector(state=>state.user)
  useEffect(() => {
    const fetchDistricts = async () => {
      if (!cityId) return;

      try {
        setLoading(true);
            const res = await CitiesAPI.getDistrictsByCityId(cityId, userDetail.access_token);
            if(res.data){

                setDistricts(res?.data?.districts);
            }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDistricts();
  }, [cityId]);

  return { districts, loading, error };
};
