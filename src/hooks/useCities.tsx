import { useState, useEffect } from 'react';
import { CitiesAPI } from '../services/modules/citiesServices';
import { useSelector } from 'react-redux';

type City ={
    code:string;
codename:string;
districts:[];

division_type:string;
name:string;

phone_code:string
_id:string

}
export const useCities = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
    const user = useSelector(state=>state.user)
  useEffect(() => {
    // Replace this with your actual API call or data source
    const fetchCities = async () => {
      try {
        setLoading(true);
        // Example data
        const cityData = await CitiesAPI.getCities(user.access_token);
        setCities(cityData.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading, error };
};
