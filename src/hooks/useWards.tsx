import { useState, useEffect } from 'react';
import { CitiesAPI } from '../services/modules/citiesServices';
import { useSelector } from 'react-redux';

type Ward = {
    code:string;
    codename:string;
    division_type:string;
    name:string;
    short_codename:string;
    _id:string
}
export const useWards = (districtId:string) => {
  const [wards, setWards] = useState<Ward[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const userDetail = useSelector(state=>state.user);
  useEffect(() => {
    const fetchWards = async () => {
      if (!districtId) return;

      try {
        setLoading(true);
        const res = await CitiesAPI.getWardsByDistrictId(districtId, userDetail.access_token);
        if(res.data){
          setWards(res?.data?.wards);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchWards();
  }, [districtId]);

  return { wards, loading, error };
};
